import {
  fetchGistdaFloodTile,
  gistdaPilotStatus,
  GistdaProviderError,
  type GistdaEnv,
  type GistdaRequestLog,
} from './providers/gistda';
import {
  fetchRidWaterData,
  ridPilotStatus,
  RidProviderError,
  type RidEnv,
} from './providers/rid';

type Env = GistdaEnv & RidEnv;

const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
} as const;

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init.headers,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        phase: '2.6',
        realDataConnected: false,
        operationalUseApproved: false,
        providers: {
          gistda: {
            status: gistdaPilotStatus(env),
            authentication: env.GISTDA_API_KEY ? 'configured' : 'not_configured',
            dataFreshness: 'UNKNOWN',
            lastSuccessfulRequest: null,
            lastFailure: null,
            latency: null,
          },
          rid: {
            status: ridPilotStatus(env),
            authentication: 'none_required',
            dataFreshness: 'UNKNOWN',
            lastSuccessfulRequest: null,
            lastFailure: null,
            latency: null,
          },
        },
      });
    }

    const tileMatch = url.pathname.match(
      /^\/api\/providers\/gistda\/flood\/1day\/tiles\/(\d+)\/(\d+)\/(\d+)\.png$/,
    );
    if (request.method === 'GET' && tileMatch) {
      try {
        const [, z, x, y] = tileMatch;
        const result = await fetchGistdaFloodTile(
          { z: Number(z), x: Number(x), y: Number(y) },
          env,
          {
            logger: (entry: GistdaRequestLog) => console.info(entry),
          },
        );
        return new Response(result.bytes, {
          headers: {
            'content-type': result.contentType,
            'cache-control': 'no-store',
            'x-content-type-options': 'nosniff',
            'x-data-provider': result.metadata.provider,
            'x-data-observed-at': 'unknown',
            'x-data-retrieved-at': result.metadata.retrievedAt,
            'x-data-freshness': result.metadata.freshness,
          },
        });
      } catch (error) {
        const providerError =
          error instanceof GistdaProviderError
            ? error
            : new GistdaProviderError(
                'GISTDA_UNAVAILABLE',
                503,
                'GISTDA data temporarily unavailable',
              );
        return jsonResponse(
          {
            error: {
              code: providerError.code,
              message: providerError.message,
              provider: 'GISTDA',
              retryable: providerError.status >= 500,
            },
          },
          { status: providerError.status },
        );
      }
    }

    if (request.method === 'GET' && url.pathname === '/api/providers/rid/dams') {
      try {
        const result = await fetchRidWaterData(env);
        return jsonResponse(result);
      } catch (error) {
        const providerError =
          error instanceof RidProviderError
            ? error
            : new RidProviderError(
                'RID_UNAVAILABLE',
                503,
                'RID data temporarily unavailable',
              );
        return jsonResponse(
          {
            error: {
              code: providerError.code,
              message: providerError.message,
              provider: 'RID',
              retryable: providerError.status >= 500,
            },
          },
          { status: providerError.status },
        );
      }
    }

    return jsonResponse(
      {
        error: {
          code: 'NOT_FOUND',
          message: 'API route not found',
        },
      },
      { status: 404 },
    );
  },
} satisfies ExportedHandler<Env>;
