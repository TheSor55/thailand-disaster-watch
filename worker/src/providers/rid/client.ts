import { RidProviderError, errorForUpstreamStatus } from './errors';
import type { RidEnv, RidPilotStatus, RidObservationResult, RidFetcher } from './types';
import type { WaterStationObservation } from '../../../../src/domain/water';

const RID_DAM_API_URL = 'https://app.rid.go.th/reservoir/api/dam/public';

interface RequestOptions {
  fetcher?: RidFetcher;
  now?: () => Date;
  requestId?: string;
}

export function ridPilotStatus(env: RidEnv): RidPilotStatus {
  if (env.RID_PILOT_ENABLED !== 'true') return 'DISABLED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchRidWaterData(
  env: RidEnv,
  options: RequestOptions = {}
): Promise<RidObservationResult> {
  const status = ridPilotStatus(env);
  if (status !== 'READY_FOR_CONTROLLED_PILOT') {
    throw new RidProviderError(
      'RID_PILOT_DISABLED',
      503,
      'RID Water Pilot is currently disabled'
    );
  }

  const fetcher = options.fetcher || (fetch as unknown as RidFetcher);
  const now = options.now ? options.now() : new Date();

  let response: Response;
  try {
    response = await fetcher(RID_DAM_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Thailand-Disaster-Watch-Pilot/1.0',
      },
    });
  } catch (error) {
    throw new RidProviderError(
      'RID_UNAVAILABLE',
      502,
      `RID network connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  if (!response.ok) {
    throw errorForUpstreamStatus(response.status);
  }

  let rawData: unknown;
  try {
    rawData = await response.json();
  } catch {
    throw new RidProviderError(
      'INVALID_RESPONSE',
      502,
      'RID response body is not valid JSON'
    );
  }

  // Parse and normalize the dataset
  const observations: WaterStationObservation[] = [];

  // Accept either a direct array or wrapped data object containing array
  const rawList = Array.isArray(rawData)
    ? rawData
    : (rawData && typeof rawData === 'object' && 'data' in rawData && Array.isArray((rawData as Record<string, unknown>).data))
      ? (rawData as Record<string, unknown>).data as unknown[]
      : null;

  if (!rawList) {
    throw new RidProviderError(
      'INVALID_RESPONSE',
      502,
      'RID response schema is malformed (expected array or wrapped data list)'
    );
  }

  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;

    // Discover identifiers
    const stationId = String(item.dam_id || item.project_id || item.id || item.code || '');
    const stationName = String(item.dam_name || item.project_name || item.name || '');
    if (!stationId || !stationName) continue;

    // Discover coordinates (if present, do not geocode or infer if missing)
    const latitude = typeof item.latitude === 'number' ? item.latitude : 0;
    const longitude = typeof item.longitude === 'number' ? item.longitude : 0;

    // Discover observed timestamp (observed date is usually YYYY-MM-DD or DD/MM/YYYY)
    const rawDate = item.dam_date || item.observed_date || item.date || item.datetime;
    let observedAt: string | null = null;
    if (typeof rawDate === 'string' && rawDate.trim().length > 0) {
      // Validate date layout
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        observedAt = `${rawDate}T00:00:00Z`;
      } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
        const [dd, mm, yyyy] = rawDate.split('/');
        observedAt = `${yyyy}-${mm}-${dd}T00:00:00Z`;
      } else {
        // Fallback for other standard ISO strings
        const parsed = Date.parse(rawDate);
        if (!isNaN(parsed)) {
          observedAt = new Date(parsed).toISOString();
        }
      }
    }

    const retrievedAt = now.toISOString();

    // Map reservoir storage parameter
    const rawStorage = item.volume || item.storage || item.qty || item.water_level;
    if (typeof rawStorage === 'number' || (typeof rawStorage === 'string' && !isNaN(Number(rawStorage)))) {
      observations.push({
        stationId,
        stationName,
        latitude,
        longitude,
        parameter: 'RESERVOIR_STORAGE',
        value: Number(rawStorage),
        unit: typeof item.volume_unit === 'string' ? item.volume_unit : 'million m3',
        observedAt,
        retrievedAt,
        freshness: observedAt ? 'FRESH' : 'UNKNOWN',
        provider: 'RID',
        source: 'telemetry_dam',
      });
    }

    // Map inflow parameter
    const rawInflow = item.inflow;
    if (typeof rawInflow === 'number' || (typeof rawInflow === 'string' && !isNaN(Number(rawInflow)))) {
      observations.push({
        stationId,
        stationName,
        latitude,
        longitude,
        parameter: 'INFLOW',
        value: Number(rawInflow),
        unit: typeof item.inflow_unit === 'string' ? item.inflow_unit : 'million m3/day',
        observedAt,
        retrievedAt,
        freshness: observedAt ? 'FRESH' : 'UNKNOWN',
        provider: 'RID',
        source: 'telemetry_dam',
      });
    }

    // Map outflow parameter
    const rawOutflow = item.outflow;
    if (typeof rawOutflow === 'number' || (typeof rawOutflow === 'string' && !isNaN(Number(rawOutflow)))) {
      observations.push({
        stationId,
        stationName,
        latitude,
        longitude,
        parameter: 'OUTFLOW',
        value: Number(rawOutflow),
        unit: typeof item.outflow_unit === 'string' ? item.outflow_unit : 'million m3/day',
        observedAt,
        retrievedAt,
        freshness: observedAt ? 'FRESH' : 'UNKNOWN',
        provider: 'RID',
        source: 'telemetry_dam',
      });
    }
  }

  return {
    provider: 'RID',
    datasetId: 'rid-reservoir-telemetry',
    dataType: 'OBSERVED',
    retrievedAt: now.toISOString(),
    observations,
  };
}
