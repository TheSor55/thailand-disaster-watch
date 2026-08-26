/**
 * Weather Situation UI Adapter
 *
 * This module provides the client boundary between the UI and the
 * /api/situation/weather worker endpoint. All React components must
 * consume weather situation data through this module only — never by
 * calling TMD or Open-Meteo directly.
 *
 * In DEVELOPMENT PREVIEW mode (when the pipeline is disabled),
 * a clearly-labelled fixture is returned instead of a real API call.
 */

import type { WeatherSituation } from '../domain/weather';

export type { WeatherSituation };

export interface WeatherSituationRequest {
  latitude: number;
  longitude: number;
  label?: string | null;
}

export type WeatherSituationLoadState =
  | { status: 'IDLE' }
  | { status: 'LOADING' }
  | { status: 'PIPELINE_DISABLED'; fixture: WeatherSituation }
  | { status: 'AVAILABLE'; data: WeatherSituation }
  | { status: 'PARTIAL'; data: WeatherSituation }
  | { status: 'ERROR'; message: string };

// ---------------------------------------------------------------------------
// Fixture — clearly labelled DEMO/PREVIEW data used only when gate is closed
// ---------------------------------------------------------------------------

export const WEATHER_SITUATION_FIXTURE: WeatherSituation = {
  location: { latitude: 13.7563, longitude: 100.5018, label: 'กรุงเทพฯ (ตัวอย่าง)' },
  generatedAt: new Date().toISOString(),
  observed: {
    source: 'TMD',
    observedAt: null,
    retrievedAt: new Date().toISOString(),
    precipitation: null,
    temperatureCelsius: null,
    humidityPercent: null,
    windSpeedKph: null,
    freshness: 'UNAVAILABLE',
    provenance: 'TMD weather station observation — pipeline not enabled',
  },
  forecast: {
    source: 'Open-Meteo',
    validAt: null,
    retrievedAt: new Date().toISOString(),
    precipitationMm: null,
    precipitationProbabilityPercent: null,
    temperatureCelsius: null,
    humidityPercent: null,
    windSpeedKph: null,
    freshness: 'UNAVAILABLE',
    provenance: 'Open-Meteo numerical forecast model — pipeline not enabled',
  },
  officialWarning: { present: false, source: null, issuedAt: null, validFrom: null, validTo: null },
  sourceAgreement: 'INSUFFICIENT_DATA',
  confidence: 'UNKNOWN',
  limitations: ['Weather Situation Pipeline is disabled (WEATHER_SITUATION_PIPELINE_ENABLED=false)'],
};

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

/**
 * Fetch weather situation from the worker API.
 * Returns the fixture when the pipeline gate is closed (HTTP 500 with
 * WEATHER_SITUATION_FAILED code), so the UI always has a structured object
 * to render — but marks it as PIPELINE_DISABLED.
 */
export async function fetchWeatherSituationUI(
  req: WeatherSituationRequest,
  signal?: AbortSignal,
): Promise<WeatherSituationLoadState> {
  const params = new URLSearchParams({
    lat: String(req.latitude),
    lon: String(req.longitude),
    ...(req.label ? { label: req.label } : {}),
  });

  let response: Response;
  try {
    response = await fetch(`/api/situation/weather?${params.toString()}`, { signal });
  } catch (networkErr) {
    if (networkErr instanceof DOMException && networkErr.name === 'AbortError') {
      return { status: 'IDLE' };
    }
    return { status: 'ERROR', message: 'ไม่สามารถเชื่อมต่อกับ API ได้ในขณะนี้' };
  }

  // Pipeline disabled — return fixture clearly labelled
  if (response.status === 500) {
    let body: Record<string, Record<string, string>> | null = null;
    try {
      body = (await response.json()) as Record<string, Record<string, string>>;
    } catch {
      /* ignore */
    }
    if (body?.error?.code === 'WEATHER_SITUATION_FAILED') {
      return { status: 'PIPELINE_DISABLED', fixture: WEATHER_SITUATION_FIXTURE };
    }
    return { status: 'ERROR', message: 'Pipeline error (HTTP 500)' };
  }

  if (!response.ok) {
    return { status: 'ERROR', message: `API error (HTTP ${response.status})` };
  }

  let payload: { situation?: WeatherSituation } | null = null;
  try {
    payload = (await response.json()) as { situation?: WeatherSituation };
  } catch {
    return { status: 'ERROR', message: 'ไม่สามารถอ่านข้อมูลจาก API ได้' };
  }

  if (!payload?.situation) {
    return { status: 'ERROR', message: 'รูปแบบข้อมูลจาก API ไม่ถูกต้อง' };
  }

  const sit = payload.situation;

  // Partial if one of observed/forecast is null
  if (!sit.observed || !sit.forecast) {
    return { status: 'PARTIAL', data: sit };
  }

  return { status: 'AVAILABLE', data: sit };
}
