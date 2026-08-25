import { OpenMeteoProviderError, errorForUpstreamStatus } from './errors';
import type { OpenMeteoEnv, OpenMeteoPilotStatus, OpenMeteoForecastResult, OpenMeteoFetcher } from './types';
import type { WeatherForecast } from '../../../../src/domain/weather';

const OPEN_METEO_API_URL = 'https://api.open-meteo.com/v1/forecast';
const DEFAULT_LATITUDE = 13.7563;
const DEFAULT_LONGITUDE = 100.5018;

interface RequestOptions {
  fetcher?: OpenMeteoFetcher;
  now?: () => Date;
  latitude?: number;
  longitude?: number;
}

export function openMeteoPilotStatus(env: OpenMeteoEnv): OpenMeteoPilotStatus {
  if (env.OPEN_METEO_PILOT_ENABLED !== 'true') return 'DISABLED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchOpenMeteoForecast(
  env: OpenMeteoEnv,
  options: RequestOptions = {}
): Promise<OpenMeteoForecastResult> {
  const status = openMeteoPilotStatus(env);
  if (status === 'DISABLED') {
    throw new OpenMeteoProviderError(
      'OPEN_METEO_PILOT_DISABLED',
      503,
      'Open-Meteo Weather Pilot is currently disabled'
    );
  }

  const fetcher = options.fetcher || (fetch as unknown as OpenMeteoFetcher);
  const now = options.now ? options.now() : new Date();

  const lat = options.latitude ?? DEFAULT_LATITUDE;
  const lon = options.longitude ?? DEFAULT_LONGITUDE;

  // Validate coordinates basic boundaries
  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new OpenMeteoProviderError(
      'INVALID_COORDINATES',
      400,
      'Invalid location coordinates provided'
    );
  }

  const url = `${OPEN_METEO_API_URL}?latitude=${lat}&longitude=${lon}&hourly=precipitation,precipitation_probability,rain,temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FBangkok`;

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
    throw new OpenMeteoProviderError(
      'OPEN_METEO_UNAVAILABLE',
      502,
      `Open-Meteo connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  if (!response.ok) {
    throw errorForUpstreamStatus(response.status);
  }

  let rawData: unknown;
  try {
    rawData = await response.json();
  } catch {
    throw new OpenMeteoProviderError(
      'INVALID_RESPONSE',
      502,
      'Open-Meteo response body is not valid JSON'
    );
  }

  const data = rawData as Record<string, unknown>;
  const hourly = data.hourly as Record<string, unknown> | undefined;
  
  if (!hourly || !Array.isArray(hourly.time)) {
    throw new OpenMeteoProviderError(
      'INVALID_RESPONSE',
      502,
      'Open-Meteo response schema is malformed (expected hourly forecast arrays)'
    );
  }

  const times = hourly.time as string[];
  const precipitation = (hourly.precipitation as number[] | undefined) || [];
  const prob = (hourly.precipitation_probability as number[] | undefined) || [];
  const temp = (hourly.temperature_2m as number[] | undefined) || [];
  const humidity = (hourly.relative_humidity_2m as number[] | undefined) || [];
  const wind = (hourly.wind_speed_10m as number[] | undefined) || [];

  // Determine timezone offset string from response metadata
  const offsetSec = typeof data.utc_offset_seconds === 'number' ? data.utc_offset_seconds : 25200;
  const hoursOffset = Math.floor(offsetSec / 3600);
  const formattedOffset = (hoursOffset >= 0 ? '+' : '-') + String(Math.abs(hoursOffset)).padStart(2, '0') + ':00';

  const forecasts: WeatherForecast[] = [];

  for (let i = 0; i < times.length; i++) {
    const rawTime = times[i];
    if (typeof rawTime !== 'string') continue;

    // Convert local format "YYYY-MM-DDTHH:mm" to precise offset ISO string
    let validFrom: string | null = null;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(rawTime)) {
      validFrom = `${rawTime}:00${formattedOffset}`;
    } else {
      const parsed = Date.parse(rawTime);
      if (!isNaN(parsed)) {
        validFrom = new Date(parsed).toISOString();
      }
    }

    const precipitationMm = typeof precipitation[i] === 'number' ? precipitation[i] : null;
    const precipitationProbabilityPercent = typeof prob[i] === 'number' ? prob[i] : null;
    const temperatureCelsius = typeof temp[i] === 'number' ? temp[i] : null;
    const humidityPercent = typeof humidity[i] === 'number' ? humidity[i] : null;
    const windSpeedKph = typeof wind[i] === 'number' ? wind[i] : null;

    forecasts.push({
      provider: 'Open-Meteo',
      targetProvince: 'Bangkok',
      forecastText: 'Model forecast prediction',
      time: {
        validFrom,
        issuedAt: null, // Open-Meteo does not provide explicit issuance timestamps
        retrievedAt: now.toISOString(),
      },
      precipitationMm,
      precipitationProbabilityPercent,
      temperatureCelsius,
      humidityPercent,
      windSpeedKph,
    });
  }

  return {
    provider: 'Open-Meteo',
    datasetId: 'open-meteo-forecast',
    dataType: 'MODEL_FORECAST',
    retrievedAt: now.toISOString(),
    forecasts,
  };
}
