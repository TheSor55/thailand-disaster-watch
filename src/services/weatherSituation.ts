/**
 * Weather Situation UI Adapter — Phase 3.2
 *
 * This module provides the client boundary between the UI and the
 * /api/situation/weather worker endpoint. All React components must
 * consume weather situation data through this module only — never by
 * calling TMD or Open-Meteo directly from the browser.
 *
 * Two explicit modes:
 * 1. DEMO: Returns deterministic, labeled fixture data without network calls.
 * 2. LIVE: Calls /api/situation/weather. If disabled or failing, returns
 *    explicit LIVE_UNAVAILABLE state without silent fixture fallback.
 */

import type { WeatherSituation } from '../domain/weather';

export type { WeatherSituation };

export type WeatherPreviewMode = 'DEMO' | 'LIVE';

export interface WeatherSituationRequest {
  latitude: number;
  longitude: number;
  label?: string | null;
  mode: WeatherPreviewMode;
}

export type WeatherSituationLoadState =
  | { status: 'IDLE' }
  | { status: 'LOADING' }
  | { status: 'DEMO'; data: WeatherSituation }
  | { status: 'AVAILABLE'; data: WeatherSituation }
  | { status: 'PARTIAL'; data: WeatherSituation }
  | { status: 'LIVE_UNAVAILABLE'; message: string; code?: string }
  | { status: 'ERROR'; message: string };

// ---------------------------------------------------------------------------
// Verified Location Presets
// ---------------------------------------------------------------------------

export interface LocationPreset {
  id: string;
  nameTh: string;
  nameEn: string;
  latitude: number;
  longitude: number;
}

export const VERIFIED_LOCATION_PRESETS: readonly LocationPreset[] = [
  { id: 'bangkok', nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', latitude: 13.7563, longitude: 100.5018 },
  { id: 'chiang-mai', nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', latitude: 18.7883, longitude: 98.9853 },
  { id: 'khon-kaen', nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', latitude: 16.4322, longitude: 102.8236 },
  { id: 'phuket', nameTh: 'ภูเก็ต', nameEn: 'Phuket', latitude: 7.8804, longitude: 98.3923 },
  { id: 'hat-yai', nameTh: 'หาดใหญ่ (สงขลา)', nameEn: 'Hat Yai', latitude: 7.0084, longitude: 100.4767 },
] as const;

export function validateCoordinates(lat: number, lon: number): { valid: boolean; error?: string } {
  if (isNaN(lat) || isNaN(lon)) {
    return { valid: false, error: 'พิกัดต้องเป็นตัวเลขที่ถูกต้อง' };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'ละติจูดต้องอยู่ระหว่าง -90 ถึง 90 องศา' };
  }
  if (lon < -180 || lon > 180) {
    return { valid: false, error: 'ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180 องศา' };
  }
  return { valid: true };
}

// ---------------------------------------------------------------------------
// Deterministic Fixture Generator for DEMO Mode
// ---------------------------------------------------------------------------

export function createDemoWeatherFixture(
  latitude: number,
  longitude: number,
  label?: string | null,
): WeatherSituation {
  return {
    location: {
      latitude,
      longitude,
      label: label ?? 'ตัวอย่างพัฒนา (DEMO)',
    },
    generatedAt: new Date().toISOString(),
    observed: {
      source: 'TMD (Demo Fixture)',
      observedAt: null,
      retrievedAt: new Date().toISOString(),
      precipitation: null,
      temperatureCelsius: 32.5,
      humidityPercent: 70,
      windSpeedKph: 12.0,
      freshness: 'UNAVAILABLE',
      provenance: 'Demo observation fixture (deterministic preview)',
    },
    forecast: {
      source: 'Open-Meteo (Demo Fixture)',
      validAt: null,
      retrievedAt: new Date().toISOString(),
      precipitationMm: 0.0,
      precipitationProbabilityPercent: 20,
      temperatureCelsius: 31.0,
      humidityPercent: 74,
      windSpeedKph: 14.0,
      freshness: 'UNAVAILABLE',
      provenance: 'Demo numerical forecast fixture (deterministic preview)',
    },
    officialWarning: {
      present: false,
      source: null,
      issuedAt: null,
      validFrom: null,
      validTo: null,
    },
    sourceAgreement: 'INSUFFICIENT_DATA',
    confidence: 'UNKNOWN',
    limitations: [
      'ข้อมูลตัวอย่างสำหรับทดสอบ (DEMO DATA) — ไม่ใช่ข้อมูลสังเกตการณ์จริง',
      'ไม่ใช่ประกาศเตือนภัยทางการ (Not an official warning)',
    ],
  };
}

export const WEATHER_SITUATION_FIXTURE = createDemoWeatherFixture(13.7563, 100.5018, 'กรุงเทพฯ (ตัวอย่าง)');

// ---------------------------------------------------------------------------
// Client Fetcher
// ---------------------------------------------------------------------------

/**
 * Fetch weather situation based on explicit mode.
 * - In DEMO mode: Returns deterministic fixture without network call.
 * - In LIVE mode: Requests /api/situation/weather. Never falls back to fixture silently.
 */
export async function fetchWeatherSituationUI(
  req: WeatherSituationRequest,
  signal?: AbortSignal,
): Promise<WeatherSituationLoadState> {
  // Mode A: DEMO PREVIEW — zero external network calls
  if (req.mode === 'DEMO') {
    const fixture = createDemoWeatherFixture(req.latitude, req.longitude, req.label);
    return { status: 'DEMO', data: fixture };
  }

  // Mode B: CONTROLLED LIVE PREVIEW — route through Cloudflare Worker API
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
    return {
      status: 'LIVE_UNAVAILABLE',
      message: 'ไม่สามารถเชื่อมต่อกับ Worker API Gateway ได้ (ตรวจสอบว่า Worker กำลังทำงานบน port 8787 หรือไม่)',
    };
  }

  // Pipeline disabled or server-side error
  if (response.status === 500) {
    let body: Record<string, Record<string, string>> | null = null;
    try {
      body = (await response.json()) as Record<string, Record<string, string>>;
    } catch {
      /* ignore */
    }

    if (body?.error?.code === 'WEATHER_SITUATION_FAILED') {
      const detail = body.error.message || 'Weather Situation Pipeline is disabled';
      return {
        status: 'LIVE_UNAVAILABLE',
        code: 'WEATHER_SITUATION_FAILED',
        message: `Pipeline ยังไม่ได้เปิดใช้งานในสภาพแวดล้อมนี้ (${detail})`,
      };
    }

    return {
      status: 'LIVE_UNAVAILABLE',
      message: `Worker API ส่งกลับข้อผิดพลาด (HTTP 500)`,
    };
  }

  if (!response.ok) {
    return {
      status: 'LIVE_UNAVAILABLE',
      message: `API Gateway แจ้งข้อผิดพลาด (HTTP ${response.status})`,
    };
  }

  let payload: { situation?: WeatherSituation } | null = null;
  try {
    payload = (await response.json()) as { situation?: WeatherSituation };
  } catch {
    return { status: 'ERROR', message: 'ไม่สามารถอ่านโครงสร้างข้อมูล JSON จาก API ได้' };
  }

  if (!payload?.situation) {
    return { status: 'ERROR', message: 'รูปแบบข้อมูลจาก API ไม่ตรงตาม WeatherSituation schema' };
  }

  const sit = payload.situation;

  // Partial if observed or forecast is null
  if (!sit.observed || !sit.forecast) {
    return { status: 'PARTIAL', data: sit };
  }

  return { status: 'AVAILABLE', data: sit };
}
