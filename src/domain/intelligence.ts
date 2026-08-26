/**
 * Weather & Radar Intelligence Domain Model — Phase 3.5
 *
 * Provides domain models for time alignment, conservative source comparison,
 * and semantic boundary governance across TMD, RainViewer, and Open-Meteo.
 *
 * Strict invariants:
 * - Never interpolate or fabricate missing timestamps.
 * - Never treat Radar as MODEL_FORECAST or OFFICIAL_WARNING.
 * - Never calculate synthetic system confidence (defaults to UNKNOWN).
 * - No nowcasting, no motion vectors, no rain arrival ETA.
 */

export interface SituationTimeContext {
  referenceTime: string; // ISO 8601 UTC timestamp of current situation assessment
  observedTime: string | null; // ISO timestamp of TMD station observation
  observedDeltaMinutes: number | null;
  radarFrameTime: string | null; // ISO timestamp of RainViewer radar scan
  radarDeltaMinutes: number | null;
  forecast1hValidTime: string | null; // ISO timestamp of Open-Meteo +1h
  forecast1hDeltaMinutes: number | null;
  forecast3hValidTime: string | null; // ISO timestamp of Open-Meteo +3h
  forecast3hDeltaMinutes: number | null;
}

export type SourceComparisonState =
  | 'CONSISTENT'
  | 'PARTIAL_AGREEMENT'
  | 'CONFLICT'
  | 'INSUFFICIENT_DATA'
  | 'NOT_COMPARABLE';

export interface SourceComparisonResult {
  state: SourceComparisonState;
  summaryTh: string;
  detailsTh: string;
  confidence: 'UNKNOWN'; // Strict rule: No synthetic confidence
}

function calculateDeltaMinutes(referenceTimeIso: string, targetTimeIso: string | null | undefined): number | null {
  if (!targetTimeIso) return null;
  try {
    const refMs = new Date(referenceTimeIso).getTime();
    const targetMs = new Date(targetTimeIso).getTime();
    if (isNaN(refMs) || isNaN(targetMs)) return null;
    return Math.round((targetMs - refMs) / (1000 * 60));
  } catch {
    return null;
  }
}

/**
 * Builds conservative SituationTimeContext preserving exact original timestamps
 */
export function buildSituationTimeContext(
  referenceTimeIso: string,
  observedTimeIso: string | null | undefined,
  radarFrameTimeIso: string | null | undefined,
  forecast1hValidIso: string | null | undefined,
  forecast3hValidIso: string | null | undefined,
): SituationTimeContext {
  return {
    referenceTime: referenceTimeIso,
    observedTime: observedTimeIso || null,
    observedDeltaMinutes: calculateDeltaMinutes(referenceTimeIso, observedTimeIso),
    radarFrameTime: radarFrameTimeIso || null,
    radarDeltaMinutes: calculateDeltaMinutes(referenceTimeIso, radarFrameTimeIso),
    forecast1hValidTime: forecast1hValidIso || null,
    forecast1hDeltaMinutes: calculateDeltaMinutes(referenceTimeIso, forecast1hValidIso),
    forecast3hValidTime: forecast3hValidIso || null,
    forecast3hDeltaMinutes: calculateDeltaMinutes(referenceTimeIso, forecast3hValidIso),
  };
}

/**
 * Compares TMD station observation with Open-Meteo forecast and RainViewer radar
 * using deterministic, conservative comparison rules.
 */
export function compareWeatherAndRadarSources(params: {
  hasObservedData: boolean;
  isObservedRaining: boolean | null;
  hasForecastData: boolean;
  forecast1hProb: number | null;
  forecast1hPrecipMm: number | null;
  hasRadarData: boolean;
}): SourceComparisonResult {
  const {
    hasObservedData,
    isObservedRaining,
    hasForecastData,
    forecast1hProb,
    forecast1hPrecipMm,
    hasRadarData,
  } = params;

  if (!hasObservedData || isObservedRaining === null) {
    return {
      state: 'INSUFFICIENT_DATA',
      summaryTh: 'ข้อมูลสังเกตการณ์สถานีไม่เพียงพอ',
      detailsTh: 'ไม่มีข้อมูลตรวจวัดภาคพื้นดินล่าสุดจาก TMD สำหรับเปรียบเทียบความสอดคล้อง',
      confidence: 'UNKNOWN',
    };
  }

  if (!hasForecastData || forecast1hProb === null) {
    return {
      state: 'INSUFFICIENT_DATA',
      summaryTh: 'ข้อมูลแบบจำลองพยากรณ์ไม่เพียงพอ',
      detailsTh: 'มีข้อมูลตรวจวัดสถานี แต่ไม่มีข้อมูลพยากรณ์ +1h สำหรับเปรียบเทียบ',
      confidence: 'UNKNOWN',
    };
  }

  // Case 1: Station observes rain AND model predicts high chance of rain in +1h
  if (isObservedRaining && (forecast1hProb >= 50 || (forecast1hPrecipMm ?? 0) >= 0.5)) {
    return {
      state: 'CONSISTENT',
      summaryTh: 'ข้อมูลสอดคล้องกัน (พบฝน)',
      detailsTh: `สถานีตรวจวัดภาคพื้นดินรายงานมีฝนตก และแบบจำลอง Open-Meteo คาดการณ์โอกาสฝนในอีก 1 ชม. ที่ ${forecast1hProb}%${hasRadarData ? ' (เรดาร์พร้อมใช้งานเป็นข้อมูลภาพประกอบ)' : ''}`,
      confidence: 'UNKNOWN',
    };
  }

  // Case 2: Station observes dry AND model predicts dry in +1h (< 30% and < 0.1mm)
  if (!isObservedRaining && forecast1hProb < 30 && (forecast1hPrecipMm ?? 0) < 0.1) {
    return {
      state: 'CONSISTENT',
      summaryTh: 'ข้อมูลสอดคล้องกัน (ไม่มีฝน)',
      detailsTh: `สถานีตรวจวัดภาคพื้นดินรายงานไม่มีฝน และแบบจำลอง Open-Meteo คาดการณ์โอกาสฝนต่ำ (${forecast1hProb}%) ในอีก 1 ชม.`,
      confidence: 'UNKNOWN',
    };
  }

  // Case 3: Station observes dry, but model forecasts rain in +1h (>= 50%)
  if (!isObservedRaining && forecast1hProb >= 50) {
    return {
      state: 'PARTIAL_AGREEMENT',
      summaryTh: 'สถานะต่างช่วงเวลา (ปัจจุบันไม่มีฝน แต่แบบจำลองคาดการณ์มีฝนล่วงหน้า)',
      detailsTh: `สถานีปัจจุบันยังไม่มีฝน แต่แบบจำลองคาดการณ์ว่าอาจมีฝนในอีก 1 ชม. (โอกาส ${forecast1hProb}%)${hasRadarData ? ' — แนะนำตรวจสอบภาพเรดาร์สังเกตการณ์ประกอบ' : ''}`,
      confidence: 'UNKNOWN',
    };
  }

  // Case 4: Station observes rain, but model predicts very dry (< 20% and 0mm)
  if (isObservedRaining && forecast1hProb < 20 && (forecast1hPrecipMm ?? 0) === 0) {
    return {
      state: 'CONFLICT',
      summaryTh: 'ข้อมูลมีความขัดแย้ง (ตรวจพบฝน แต่แบบจำลองคาดการณ์ไม่มีฝน)',
      detailsTh: `สถานีตรวจวัดภาคพื้นดินตรวจพบฝนตก แต่แบบจำลอง Open-Meteo คาดการณ์โอกาสฝนต่ำมาก (${forecast1hProb}%) ในอีก 1 ชม.`,
      confidence: 'UNKNOWN',
    };
  }

  return {
    state: 'PARTIAL_AGREEMENT',
    summaryTh: 'สอดคล้องบางส่วนตามช่วงเวลา',
    detailsTh: `สถานีรายงาน ${isObservedRaining ? 'มีฝน' : 'ไม่มีฝน'} ขณะที่แบบจำลองคาดการณ์โอกาสฝน ${forecast1hProb}% ในอีก 1 ชม.`,
    confidence: 'UNKNOWN',
  };
}
