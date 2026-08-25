export type WaterParameter =
  | 'RIVER_LEVEL'
  | 'DISCHARGE'
  | 'INFLOW'
  | 'OUTFLOW'
  | 'RESERVOIR_STORAGE'
  | 'RAINFALL';

export type FreshnessState = 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';

export interface WaterStationObservation {
  stationId: string;
  stationName: string;
  latitude: number;
  longitude: number;
  parameter: WaterParameter;
  value: number;
  unit: string;
  observedAt: string | null;
  retrievedAt: string;
  freshness: FreshnessState;
  provider: string;
  source: string;
}

export interface MonitoringStation {
  provider: string;
  stationId: string;
  name: string;
  latitude: number;
  longitude: number;
  province: string;
  stationType: string;
  parameters: readonly WaterParameter[];
}

export type SourceConflictState =
  | 'CONSISTENT'
  | 'PARTIAL_AGREEMENT'
  | 'CONFLICT'
  | 'INSUFFICIENT_DATA';

export function compareWaterObservations(
  obsA: WaterStationObservation | null | undefined,
  obsB: WaterStationObservation | null | undefined,
  tolerance = 0.05
): SourceConflictState {
  if (!obsA || !obsB) return 'INSUFFICIENT_DATA';
  if (obsA.parameter !== obsB.parameter) return 'INSUFFICIENT_DATA';
  if (obsA.observedAt !== obsB.observedAt) return 'INSUFFICIENT_DATA';

  const diff = Math.abs(obsA.value - obsB.value);
  const maxVal = Math.max(Math.abs(obsA.value), Math.abs(obsB.value));
  if (maxVal === 0) return 'CONSISTENT';

  const ratio = diff / maxVal;
  if (ratio <= tolerance) return 'CONSISTENT';
  if (ratio <= tolerance * 2) return 'PARTIAL_AGREEMENT';
  return 'CONFLICT';
}
