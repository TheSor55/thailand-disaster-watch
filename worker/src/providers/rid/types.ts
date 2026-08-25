import type { WaterStationObservation } from '../../../../src/domain/water';

export interface RidEnv {
  RID_PILOT_ENABLED?: string;
  RID_REQUEST_TIMEOUT_MS?: string;
}

export type RidPilotStatus =
  | 'DISABLED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type RidErrorCode =
  | 'RID_PILOT_DISABLED'
  | 'RID_UNAVAILABLE'
  | 'INVALID_RESPONSE'
  | 'TIMEOUT'
  | 'NO_DATA';

export interface RidRequestLog {
  requestId: string;
  provider: 'RID';
  dataset: 'rid-dam-telemetry';
  route: '/api/providers/rid/dams';
  outcome: 'success' | 'failure';
  statusCode: number;
  latency: number;
  timestamp: string;
}

export interface RidObservationResult {
  provider: 'RID';
  datasetId: 'rid-dam-telemetry';
  dataType: 'OBSERVED';
  retrievedAt: string;
  observations: WaterStationObservation[];
}

export type RidFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
