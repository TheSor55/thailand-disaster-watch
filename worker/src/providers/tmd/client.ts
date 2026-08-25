import { TmdProviderError, errorForUpstreamStatus } from './errors';
import type { TmdEnv, TmdPilotStatus, TmdObservationResult, TmdFetcher } from './types';
import type { WeatherObservation } from '../../../../src/domain/weather';

const TMD_OBSERVATION_API_URL = 'https://data.tmd.go.th/api/Weather3Hours/v1.1/';

interface RequestOptions {
  fetcher?: TmdFetcher;
  now?: () => Date;
  requestId?: string;
}

export function tmdPilotStatus(env: TmdEnv): TmdPilotStatus {
  if (env.TMD_PILOT_ENABLED !== 'true') return 'DISABLED';
  if (!env.TMD_UID || !env.TMD_UKEY) return 'CONFIGURATION_REQUIRED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchTmdWeatherData(
  env: TmdEnv,
  options: RequestOptions = {}
): Promise<TmdObservationResult> {
  const status = tmdPilotStatus(env);
  if (status === 'DISABLED') {
    throw new TmdProviderError(
      'TMD_PILOT_DISABLED',
      503,
      'TMD Weather Pilot is currently disabled or unconfigured'
    );
  }
  if (status === 'CONFIGURATION_REQUIRED') {
    throw new TmdProviderError(
      'AUTHENTICATION_NOT_CONFIGURED',
      401,
      'TMD API credentials (UID/UKey) are missing or unconfigured'
    );
  }

  const fetcher = options.fetcher || (fetch as unknown as TmdFetcher);
  const now = options.now ? options.now() : new Date();

  const url = `${TMD_OBSERVATION_API_URL}?uid=${env.TMD_UID}&ukey=${env.TMD_UKEY}&format=json`;

  let response: Response;
  try {
    response = await fetcher(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Thailand-Disaster-Watch-Pilot/1.0',
      },
    });
  } catch (error) {
    throw new TmdProviderError(
      'TMD_UNAVAILABLE',
      502,
      `TMD network connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  if (!response.ok) {
    throw errorForUpstreamStatus(response.status);
  }

  let rawData: unknown;
  try {
    rawData = await response.json();
  } catch {
    throw new TmdProviderError(
      'INVALID_RESPONSE',
      502,
      'TMD response body is not valid JSON'
    );
  }

  // Parse and normalize the observations array
  const observations: WeatherObservation[] = [];

  // Accept standard TMD object layout containing Stations array
  const rawList = (rawData && typeof rawData === 'object' && 'Stations' in rawData && Array.isArray((rawData as Record<string, unknown>).Stations))
    ? (rawData as Record<string, unknown>).Stations as unknown[]
    : (rawData && typeof rawData === 'object' && 'stations' in rawData && Array.isArray((rawData as Record<string, unknown>).stations))
      ? (rawData as Record<string, unknown>).stations as unknown[]
      : Array.isArray(rawData)
        ? rawData as unknown[]
        : null;

  if (!rawList) {
    throw new TmdProviderError(
      'INVALID_RESPONSE',
      502,
      'TMD response schema is malformed (expected list under Stations key)'
    );
  }

  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;

    const dataItem = item as Record<string, unknown>;

    // Discover identifiers
    const stationId = String(dataItem.StationNumber || dataItem.WmoNumber || dataItem.wmo || dataItem.id || '');
    const stationName = String(dataItem.StationNameEng || dataItem.StationNameTh || dataItem.name || '');
    if (!stationId || !stationName) continue;

    // Discover observed timestamp (e.g. YYYY-MM-DD HH:mm:ss in Thai UTC+7 timezone)
    const observe = dataItem.Observe && typeof dataItem.Observe === 'object'
      ? (dataItem.Observe as Record<string, unknown>)
      : dataItem.observe && typeof dataItem.observe === 'object'
        ? (dataItem.observe as Record<string, unknown>)
        : null;

    let observedAt: string | null = null;
    let rawDate: unknown = null;

    if (observe) {
      rawDate = observe.Time || observe.time || observe.date || observe.datetime;
      if (typeof rawDate === 'string' && rawDate.trim().length > 0) {
        const cleaned = rawDate.trim();
        // Check standard TMD format: YYYY-MM-DD HH:mm:ss
        if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/.test(cleaned)) {
          const formatted = cleaned.replace(' ', 'T');
          observedAt = `${formatted}+07:00`;
        } else {
          // Standard fallback
          const parsed = Date.parse(cleaned);
          if (!isNaN(parsed)) {
            observedAt = new Date(parsed).toISOString();
          }
        }
      }
    }

    // Map observed parameters
    let temperatureCelsius: number | null = null;
    let humidityPercent: number | null = null;
    let windSpeedKph: number | null = null;

    if (observe) {
      const tempObj = observe.Temperature && typeof observe.Temperature === 'object'
        ? (observe.Temperature as Record<string, unknown>)
        : observe.temperature && typeof observe.temperature === 'object'
          ? (observe.temperature as Record<string, unknown>)
          : null;
      if (tempObj && (tempObj.Value !== undefined || tempObj.value !== undefined)) {
        const val = Number(tempObj.Value ?? tempObj.value);
        if (!isNaN(val)) temperatureCelsius = val;
      }

      const humidObj = observe.RelativeHumidity && typeof observe.RelativeHumidity === 'object'
        ? (observe.RelativeHumidity as Record<string, unknown>)
        : observe.relative_humidity && typeof observe.relative_humidity === 'object'
          ? (observe.relative_humidity as Record<string, unknown>)
          : null;
      if (humidObj && (humidObj.Value !== undefined || humidObj.value !== undefined)) {
        const val = Number(humidObj.Value ?? humidObj.value);
        if (!isNaN(val)) humidityPercent = val;
      }

      const windObj = observe.WindSpeed && typeof observe.WindSpeed === 'object'
        ? (observe.WindSpeed as Record<string, unknown>)
        : observe.wind_speed && typeof observe.wind_speed === 'object'
          ? (observe.wind_speed as Record<string, unknown>)
          : null;
      if (windObj && (windObj.Value !== undefined || windObj.value !== undefined)) {
        const val = Number(windObj.Value ?? windObj.value);
        const unit = String(windObj.Unit ?? windObj.unit ?? '');
        if (!isNaN(val)) {
          if (unit.toLowerCase() === 'knots' || unit.toLowerCase() === 'knot') {
            windSpeedKph = val * 1.852;
          } else if (unit.toLowerCase() === 'kph' || unit.toLowerCase() === 'km/h') {
            windSpeedKph = val;
          }
          // Do not infer unit if absent or unrecognized
        }
      }
    }

    observations.push({
      provider: 'TMD',
      stationId,
      temperatureCelsius,
      humidityPercent,
      windSpeedKph,
      time: {
        observedAt,
        retrievedAt: now.toISOString(),
      },
    });
  }

  return {
    provider: 'TMD',
    datasetId: 'tmd-weather-observation',
    dataType: 'OBSERVED',
    retrievedAt: now.toISOString(),
    observations,
  };
}
