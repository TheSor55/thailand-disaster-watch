export interface GistdaEnv {
  GISTDA_API_KEY?: string;
  GISTDA_PILOT_ENABLED?: string;
  GISTDA_REQUEST_TIMEOUT_MS?: string;
}

export type GistdaPilotStatus =
  | 'DISABLED'
  | 'CONFIGURATION_REQUIRED'
  | 'READY_FOR_CONTROLLED_PILOT';

export type GistdaErrorCode =
  | 'GISTDA_PILOT_DISABLED'
  | 'PILOT_CONFIGURATION_REQUIRED'
  | 'AUTHENTICATION_NOT_CONFIGURED'
  | 'AUTHENTICATION_FAILED'
  | 'RATE_LIMITED'
  | 'GISTDA_UNAVAILABLE'
  | 'TIMEOUT'
  | 'NO_DATA'
  | 'INVALID_RESPONSE';

export interface GistdaRequestLog {
  requestId: string;
  provider: 'GISTDA';
  dataset: 'gistda-disaster-flood-1day-tms';
  route: '/api/providers/gistda/flood/1day/tiles/{z}/{x}/{y}.png';
  outcome: 'success' | 'failure';
  statusCode: number;
  latency: number;
  timestamp: string;
}

export interface GistdaTileMetadata {
  provider: 'GISTDA';
  datasetId: 'gistda-disaster-flood-1day-tms';
  dataType: 'OBSERVED';
  observedAt: null;
  retrievedAt: string;
  freshness: 'UNKNOWN';
  attribution: 'GISTDA';
  productionStatus: 'PENDING';
}

export interface GistdaTileResult {
  bytes: ArrayBuffer;
  contentType: 'image/png';
  metadata: GistdaTileMetadata;
}

export type GistdaFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
