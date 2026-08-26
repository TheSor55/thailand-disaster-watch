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
import {
  fetchTmdWeatherData,
  tmdPilotStatus,
  TmdProviderError,
  type TmdEnv,
} from './providers/tmd';
import {
  fetchOpenMeteoForecast,
  openMeteoPilotStatus,
  OpenMeteoProviderError,
  type OpenMeteoEnv,
} from './providers/open-meteo';

import {
  fetchRainViewerFrames,
  rainViewerPilotStatus,
  RainViewerProviderError,
  type RainViewerEnv,
} from './providers/rainviewer';

import {
  fetchWeatherSituation,
  type WeatherSituationEnv,
} from './providers/situation';

type Env = GistdaEnv & RidEnv & TmdEnv & OpenMeteoEnv & WeatherSituationEnv & RainViewerEnv;

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
          tmd: {
            status: tmdPilotStatus(env),
            authentication: (env.TMD_UID && env.TMD_UKEY) ? 'configured' : 'not_configured',
            dataFreshness: 'UNKNOWN',
            lastSuccessfulRequest: null,
            lastFailure: null,
            latency: null,
          },
          open_meteo: {
            status: openMeteoPilotStatus(env),
            authentication: 'none_required',
            dataFreshness: 'UNKNOWN',
            lastSuccessfulRequest: null,
            lastFailure: null,
            latency: null,
          },
          radar_rainviewer: {
            status: rainViewerPilotStatus(env),
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

    if (request.method === 'GET' && url.pathname === '/api/providers/tmd/weather') {
      try {
        const result = await fetchTmdWeatherData(env);
        return jsonResponse(result);
      } catch (error) {
        const providerError =
          error instanceof TmdProviderError
            ? error
            : new TmdProviderError(
                'TMD_UNAVAILABLE',
                503,
                'TMD data temporarily unavailable',
              );
        return jsonResponse(
          {
            error: {
              code: providerError.code,
              message: providerError.message,
              provider: 'TMD',
              retryable: providerError.status >= 500,
            },
          },
          { status: providerError.status },
        );
      }
    }

    if (request.method === 'GET' && url.pathname === '/api/providers/open-meteo/forecast') {
      try {
        const result = await fetchOpenMeteoForecast(env);
        return jsonResponse(result);
      } catch (error) {
        const providerError =
          error instanceof OpenMeteoProviderError
            ? error
            : new OpenMeteoProviderError(
                'OPEN_METEO_UNAVAILABLE',
                502,
                'Open-Meteo data temporarily unavailable',
              );
        return jsonResponse(
          {
            error: {
              code: providerError.code,
              message: providerError.message,
              provider: 'Open-Meteo',
              retryable: providerError.status >= 500,
            },
          },
          { status: providerError.status },
        );
      }
    }

    if (request.method === 'GET' && url.pathname === '/api/situation/weather') {
      try {
        const latParam = url.searchParams.get('lat');
        const lonParam = url.searchParams.get('lon');
        const label = url.searchParams.get('label') || null;

        const latitude = latParam ? parseFloat(latParam) : 13.7563;
        const longitude = lonParam ? parseFloat(lonParam) : 100.5018;

        const result = await fetchWeatherSituation(env as unknown as Record<string, string | undefined>, {
          latitude,
          longitude,
          label,
        });
        return jsonResponse(result);
      } catch (error) {
        return jsonResponse(
          {
            error: {
              code: 'WEATHER_SITUATION_FAILED',
              message: error instanceof Error ? error.message : 'Unknown pipeline error',
              provider: 'WEATHER_SITUATION',
              retryable: false,
            },
          },
          { status: 500 },
        );
      }
    }

    if (request.method === 'GET' && url.pathname === '/api/radar/frames') {
      try {
        const modeParam = url.searchParams.get('mode');
        const mode = modeParam === 'LIVE' ? 'LIVE' : 'DEMO';
        const result = await fetchRainViewerFrames(env, { mode });
        return jsonResponse(result);
      } catch (error) {
        const providerError =
          error instanceof RainViewerProviderError
            ? error
            : new RainViewerProviderError(
                'RAINVIEWER_UNAVAILABLE',
                502,
                error instanceof Error ? error.message : 'Radar service unavailable',
              );
        return jsonResponse(
          {
            error: {
              code: providerError.code,
              message: providerError.message,
              provider: 'RainViewer',
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
