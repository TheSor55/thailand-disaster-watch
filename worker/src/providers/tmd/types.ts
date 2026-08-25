import type { WeatherObservation } from '../../../../src/domain/weather';

export interface TmdEnv {
  TMD_UID?: string;
  TMD_UKEY?: string;
  TMD_PILOT_ENABLED?: string;
}

export type TmdPilotStatus =
  | 'DISABLED'
  | 'CONFIGURATION_REQUIRED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type TmdErrorCode =
  | 'TMD_PILOT_DISABLED'
  | 'AUTHENTICATION_NOT_CONFIGURED'
  | 'TMD_UNAVAILABLE'
  | 'INVALID_RESPONSE'
  | 'TIMEOUT'
  | 'NO_DATA';

export interface TmdRequestLog {
  requestId: string;
  provider: 'TMD';
  dataset: 'tmd-weather-observation';
  route: '/api/providers/tmd/weather';
  outcome: 'success' | 'failure';
  statusCode: number;
  latency: number;
  timestamp: string;
}

export interface TmdObservationResult {
  provider: 'TMD';
  datasetId: 'tmd-weather-observation';
  dataType: 'OBSERVED';
  retrievedAt: string;
  observations: WeatherObservation[];
}

export type TmdFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
