import { errorForUpstreamStatus, GistdaProviderError } from './errors';
import { normalizeGistdaTileMetadata } from './normalize';
import { validatePngTile } from './schema';
import type {
  GistdaEnv,
  GistdaFetcher,
  GistdaRequestLog,
  GistdaTileResult,
} from './types';

const GISTDA_BASE_URL =
  'https://api-gateway.gistda.or.th/api/2.0/resources';

interface RequestOptions {
  fetcher?: GistdaFetcher;
  now?: () => Date;
  logger?: (entry: GistdaRequestLog) => void;
}

const inFlightRequests = new Map<string, Promise<GistdaTileResult>>();

function positiveNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function validateTileCoordinate(value: number): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new GistdaProviderError(
      'INVALID_RESPONSE',
      400,
      'Invalid tile coordinate',
    );
  }
}

export function gistdaPilotStatus(env: GistdaEnv):
  | 'DISABLED'
  | 'CONFIGURATION_REQUIRED'
  | 'READY_FOR_CONTROLLED_PILOT' {
  if (env.GISTDA_PILOT_ENABLED !== 'true') return 'DISABLED';
  if (!env.GISTDA_API_KEY || !positiveNumber(env.GISTDA_REQUEST_TIMEOUT_MS)) {
    return 'CONFIGURATION_REQUIRED';
  }
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchGistdaFloodTile(
  coordinates: { z: number; x: number; y: number },
  env: GistdaEnv,
  options: RequestOptions = {},
): Promise<GistdaTileResult> {
  validateTileCoordinate(coordinates.z);
  validateTileCoordinate(coordinates.x);
  validateTileCoordinate(coordinates.y);

  if (env.GISTDA_PILOT_ENABLED !== 'true') {
    throw new GistdaProviderError(
      'GISTDA_PILOT_DISABLED',
      503,
      'GISTDA controlled pilot is disabled',
    );
  }
  if (!env.GISTDA_API_KEY) {
    throw new GistdaProviderError(
      'AUTHENTICATION_NOT_CONFIGURED',
      503,
      'GISTDA authentication is not configured',
    );
  }
  const timeoutMs = positiveNumber(env.GISTDA_REQUEST_TIMEOUT_MS);
  if (!timeoutMs) {
    throw new GistdaProviderError(
      'PILOT_CONFIGURATION_REQUIRED',
      503,
      'GISTDA timeout requires human-approved configuration',
    );
  }

  const requestKey = `${coordinates.z}/${coordinates.x}/${coordinates.y}`;
  const existingRequest = inFlightRequests.get(requestKey);
  if (existingRequest) return existingRequest;

  const request = performGistdaFloodTileRequest(
    coordinates,
    env.GISTDA_API_KEY,
    timeoutMs,
    options,
  );
  inFlightRequests.set(requestKey, request);
  try {
    return await request;
  } finally {
    if (inFlightRequests.get(requestKey) === request) {
      inFlightRequests.delete(requestKey);
    }
  }
}

async function performGistdaFloodTileRequest(
  coordinates: { z: number; x: number; y: number },
  apiKey: string,
  timeoutMs: number,
  options: RequestOptions,
): Promise<GistdaTileResult> {
  const fetcher = options.fetcher ?? fetch;
  const now = options.now ?? (() => new Date());
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let upstreamStatus = 0;

  try {
    const response = await fetcher(
      `${GISTDA_BASE_URL}/maps/flood/1day/tms/${coordinates.z}/${coordinates.x}/${coordinates.y}`,
      {
        headers: {
          accept: 'image/png',
          'API-Key': apiKey,
        },
        signal: controller.signal,
      },
    );
    upstreamStatus = response.status;
    if (!response.ok) throw errorForUpstreamStatus(response.status);

    const bytes = await validatePngTile(response);
    const retrievedAt = now().toISOString();
    options.logger?.({
      provider: 'GISTDA',
      outcome: 'success',
      statusCode: response.status,
      latencyMs: Date.now() - startedAt,
      timestamp: retrievedAt,
    });
    return {
      bytes,
      contentType: 'image/png',
      metadata: normalizeGistdaTileMetadata(retrievedAt),
    };
  } catch (error) {
    const providerError =
      error instanceof GistdaProviderError
        ? error
        : new GistdaProviderError(
            error instanceof DOMException && error.name === 'AbortError'
              ? 'TIMEOUT'
              : 'GISTDA_UNAVAILABLE',
            503,
            error instanceof DOMException && error.name === 'AbortError'
              ? 'GISTDA request timed out'
              : 'GISTDA data temporarily unavailable',
          );
    options.logger?.({
      provider: 'GISTDA',
      outcome: 'failure',
      statusCode: upstreamStatus,
      latencyMs: Date.now() - startedAt,
      timestamp: now().toISOString(),
    });
    throw providerError;
  } finally {
    clearTimeout(timeout);
  }
}
