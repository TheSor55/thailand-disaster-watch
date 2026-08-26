import { RainViewerProviderError } from './errors';
import type {
  RainViewerEnv,
  RainViewerFrameResult,
  RainViewerMetadataResult,
  RainViewerRawApiResponse,
} from './types';

const RAINVIEWER_METADATA_URL = 'https://api.rainviewer.com/public/weather-maps.json';
const MAX_FRAMES = 10;

export function rainViewerPilotStatus(env: RainViewerEnv): 'ENABLED' | 'DISABLED' {
  return env.RADAR_PREVIEW_ENABLED === 'true' && env.RAINVIEWER_PILOT_ENABLED === 'true'
    ? 'ENABLED'
    : 'DISABLED';
}

function calculateFreshness(frameDate: Date): 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN' {
  const ageMs = Date.now() - frameDate.getTime();
  const ageMin = ageMs / (1000 * 60);
  if (ageMin < 0) return 'UNKNOWN'; // future time not allowed for observed radar
  if (ageMin <= 30) return 'FRESH';
  if (ageMin <= 90) return 'DELAYED';
  return 'STALE';
}

export function generateDemoRadarFrames(): RainViewerFrameResult[] {
  const now = Date.now();
  const retrievedAt = new Date(now).toISOString();
  const frames: RainViewerFrameResult[] = [];

  // Generate 6 historical 10-minute interval frames
  for (let i = 5; i >= 0; i--) {
    const frameTimeMs = now - i * 10 * 60 * 1000;
    const frameDate = new Date(frameTimeMs);
    const frameEpoch = Math.floor(frameTimeMs / 1000);

    frames.push({
      provider: 'Demo Fixture',
      frameId: `demo_${frameEpoch}`,
      frameTime: frameDate.toISOString(),
      retrievedAt,
      // MapLibre transparent demo tile pattern
      tileUrl: 'https://tilecache.rainviewer.com/v2/radar/' + frameEpoch + '/256/{z}/{x}/{y}/2/1_1.png',
      coverage: 'THAILAND_AND_GLOBAL_MOSAIC',
      coverageNote: 'COVERAGE MAY BE INCOMPLETE',
      attribution: 'Weather radar data by RainViewer (Demo Simulation)',
      attributionUrl: 'https://www.rainviewer.com/',
      classification: 'OBSERVED_REMOTE_SENSING',
      freshness: calculateFreshness(frameDate),
      status: 'DEMO',
    });
  }

  return frames;
}

export async function fetchRainViewerFrames(
  env: RainViewerEnv,
  options: { mode?: 'DEMO' | 'LIVE'; fetchFn?: typeof fetch } = {},
): Promise<RainViewerMetadataResult> {
  const mode = options.mode || 'DEMO';
  const customFetch = options.fetchFn || fetch;

  if (mode === 'DEMO') {
    return {
      provider: 'RainViewer (Demo Mode)',
      generatedAt: new Date().toISOString(),
      mode: 'DEMO',
      frames: generateDemoRadarFrames(),
      sourceAgreement: 'NOT_APPLICABLE',
      limitations: [
        'DEMO PREVIEW: Simulates recent radar observation frames.',
        'Not connected to live radar feed in this mode.',
        'Not an official weather warning.',
      ],
      freshnessPolicy: 'INTERNAL_PREVIEW_POLICY',
    };
  }

  // LIVE mode requires safety gates
  if (rainViewerPilotStatus(env) !== 'ENABLED') {
    throw new RainViewerProviderError(
      'RADAR_PREVIEW_DISABLED',
      503,
      'Radar Preview is disabled by environment configuration (RADAR_PREVIEW_ENABLED=false)',
    );
  }

  let response: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    response = await customFetch(RAINVIEWER_METADATA_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ThailandDisasterWatch/0.1.0',
      },
    });
    clearTimeout(timeoutId);
  } catch (err) {
    throw new RainViewerProviderError(
      'RAINVIEWER_FETCH_FAILED',
      502,
      `Failed to connect to RainViewer API: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!response.ok) {
    throw new RainViewerProviderError(
      'RAINVIEWER_UNAVAILABLE',
      502,
      `RainViewer API returned HTTP ${response.status}`,
    );
  }

  let data: RainViewerRawApiResponse;
  try {
    data = (await response.json()) as RainViewerRawApiResponse;
  } catch {
    throw new RainViewerProviderError(
      'RAINVIEWER_INVALID_RESPONSE',
      502,
      'Failed to parse RainViewer JSON response',
    );
  }

  const pastFrames = data.radar?.past;
  if (!Array.isArray(pastFrames) || pastFrames.length === 0) {
    throw new RainViewerProviderError(
      'NO_FRAMES_AVAILABLE',
      502,
      'RainViewer returned no historical radar frames',
    );
  }

  const host = data.host || 'https://tilecache.rainviewer.com';
  const retrievedAt = new Date().toISOString();

  // Bounded list: up to MAX_FRAMES latest frames
  const sliced = pastFrames.slice(-MAX_FRAMES);
  const validatedFrames: RainViewerFrameResult[] = [];

  for (const raw of sliced) {
    if (typeof raw.time !== 'number' || isNaN(raw.time) || raw.time <= 0) {
      continue; // Reject frames without valid timestamp
    }
    const frameDate = new Date(raw.time * 1000);
    if (isNaN(frameDate.getTime())) {
      continue;
    }

    const tileUrl = `${host}${raw.path}/{z}/{x}/{y}/2/1_1.png`;

    validatedFrames.push({
      provider: 'RainViewer',
      frameId: String(raw.time),
      frameTime: frameDate.toISOString(),
      retrievedAt,
      tileUrl,
      coverage: 'THAILAND_AND_GLOBAL_MOSAIC',
      coverageNote: 'COVERAGE MAY BE INCOMPLETE',
      attribution: 'Weather radar data by RainViewer',
      attributionUrl: 'https://www.rainviewer.com/',
      classification: 'OBSERVED_REMOTE_SENSING',
      freshness: calculateFreshness(frameDate),
      status: 'AVAILABLE',
    });
  }

  if (validatedFrames.length === 0) {
    throw new RainViewerProviderError(
      'NO_FRAMES_AVAILABLE',
      502,
      'No valid radar frames remained after timestamp validation',
    );
  }

  return {
    provider: 'RainViewer',
    generatedAt: retrievedAt,
    mode: 'LIVE',
    frames: validatedFrames,
    sourceAgreement: 'NOT_APPLICABLE',
    limitations: [
      'OBSERVED_REMOTE_SENSING: Sensor-derived precipitation reflectance mosaic.',
      'COVERAGE MAY BE INCOMPLETE in mountainous or radar-gap zones in Thailand.',
      'Not an official emergency or storm warning.',
    ],
    freshnessPolicy: 'INTERNAL_PREVIEW_POLICY',
  };
}
