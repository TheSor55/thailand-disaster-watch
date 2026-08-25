export interface RidEnv {
  RID_PILOT_ENABLED?: string;
}

export type RidPilotStatus =
  | 'DISABLED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type RidErrorCode =
  | 'RID_PILOT_DISABLED'
  | 'RID_UNAVAILABLE';

export interface RidObservationResult {
  provider: 'RID';
  data: unknown;
}
