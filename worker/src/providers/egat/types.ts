export interface EgatEnv {
  EGAT_PILOT_ENABLED?: string;
}

export type EgatPilotStatus =
  | 'DISABLED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type EgatErrorCode =
  | 'EGAT_PILOT_DISABLED'
  | 'EGAT_UNAVAILABLE';

export interface EgatObservationResult {
  provider: 'EGAT';
  data: unknown;
}
