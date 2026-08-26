export interface RainViewerEnv {
  RADAR_PREVIEW_ENABLED?: string;
  RAINVIEWER_PILOT_ENABLED?: string;
}

export interface RainViewerRawFrame {
  time: number; // Unix epoch seconds
  path: string; // e.g. "/v2/radar/1740500000/256"
}

export interface RainViewerRawApiResponse {
  version: string;
  generated: number;
  host: string;
  radar: {
    past: RainViewerRawFrame[];
    nowcast?: RainViewerRawFrame[]; // MUST BE IGNORED / FILTERED OUT
  };
}

export interface RainViewerFrameResult {
  provider: 'RainViewer' | 'Demo Fixture';
  frameId: string;
  frameTime: string; // ISO 8601 UTC
  retrievedAt: string; // ISO 8601 UTC
  tileUrl: string; // MapLibre XYZ tile template
  coverage: 'THAILAND_AND_GLOBAL_MOSAIC';
  coverageNote: 'COVERAGE MAY BE INCOMPLETE';
  attribution: string;
  attributionUrl: string;
  classification: 'OBSERVED_REMOTE_SENSING';
  freshness: 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'DEMO';
}

export interface RainViewerMetadataResult {
  provider: string;
  generatedAt: string;
  mode: 'DEMO' | 'LIVE';
  frames: RainViewerFrameResult[];
  sourceAgreement: 'NOT_APPLICABLE';
  limitations: string[];
}
