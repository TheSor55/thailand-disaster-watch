export interface ThaiWaterEnv {
  THAIWATER_PILOT_ENABLED?: string;
  THAIWATER_API_TOKEN?: string;
}

export type ThaiWaterPilotStatus =
  | 'DISABLED'
  | 'CONFIGURATION_REQUIRED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type ThaiWaterErrorCode =
  | 'THAIWATER_PILOT_DISABLED'
  | 'THAIWATER_UNAVAILABLE';

export interface ThaiWaterObservationResult {
  provider: 'THAIWATER';
  data: unknown;
}
