export interface TmdEnv {
  TMD_API_KEY?: string;
  TMD_PILOT_ENABLED?: string;
}

export type TmdPilotStatus =
  | 'DISABLED'
  | 'CONFIGURATION_REQUIRED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type TmdErrorCode =
  | 'TMD_PILOT_DISABLED'
  | 'AUTHENTICATION_NOT_CONFIGURED'
  | 'TMD_UNAVAILABLE';

export interface TmdObservationResult {
  provider: 'TMD';
  data: unknown;
}
