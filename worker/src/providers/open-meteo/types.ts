import type { WeatherForecast } from '../../../../src/domain/weather';

export interface OpenMeteoEnv {
  OPEN_METEO_PILOT_ENABLED?: string;
  OPEN_METEO_REQUEST_TIMEOUT_MS?: string;
}

export type OpenMeteoPilotStatus =
  | 'DISABLED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type OpenMeteoErrorCode =
  | 'OPEN_METEO_PILOT_DISABLED'
  | 'OPEN_METEO_UNAVAILABLE'
  | 'INVALID_RESPONSE'
  | 'TIMEOUT'
  | 'NO_DATA'
  | 'INVALID_COORDINATES';

export interface OpenMeteoRequestLog {
  requestId: string;
  provider: 'Open-Meteo';
  dataset: 'open-meteo-forecast';
  route: '/api/providers/open-meteo/forecast';
  outcome: 'success' | 'failure';
  statusCode: number;
  latency: number;
  timestamp: string;
}

export interface OpenMeteoForecastResult {
  provider: 'Open-Meteo';
  datasetId: 'open-meteo-forecast';
  dataType: 'MODEL_FORECAST';
  retrievedAt: string;
  forecasts: WeatherForecast[];
}

export type OpenMeteoFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
