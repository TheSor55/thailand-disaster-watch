/**
 * Domain types for Radar remote-sensing observations (Phase 3.4)
 *
 * Classification: OBSERVED_REMOTE_SENSING only.
 * Radar data represents recent sensor observations; it is NOT an official warning,
 * model forecast, or nowcast.
 */

export type RadarClassification = 'OBSERVED_REMOTE_SENSING';

export type RadarFreshness = 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';

export type RadarFrameStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'DEMO';

export interface RadarFrame {
  provider: 'RainViewer' | 'Demo Fixture';
  frameId: string;
  frameTime: string; // ISO 8601 UTC timestamp of radar scan
  retrievedAt: string; // ISO 8601 UTC timestamp when metadata was obtained
  tileUrl: string; // MapLibre XYZ tile template
  coverage: 'THAILAND_AND_GLOBAL_MOSAIC';
  coverageNote: 'COVERAGE MAY BE INCOMPLETE';
  attribution: string;
  attributionUrl: string;
  classification: RadarClassification;
  freshness: RadarFreshness;
  status: RadarFrameStatus;
}

export interface RadarMetadataResponse {
  provider: string;
  generatedAt: string;
  mode: 'DEMO' | 'LIVE';
  frames: RadarFrame[];
  sourceAgreement: 'NOT_APPLICABLE';
  limitations: string[];
}

export interface RadarLayerState {
  enabled: boolean;
  opacity: number; // 0.0 to 1.0
  selectedFrameIndex: number;
  isPlaying: boolean;
}

/**
 * Calculates freshness based on frame timestamp age
 */
export function calculateRadarFreshness(frameTimeIso: string | null | undefined): RadarFreshness {
  if (!frameTimeIso) return 'UNAVAILABLE';
  try {
    const frameDate = new Date(frameTimeIso);
    if (isNaN(frameDate.getTime())) return 'UNKNOWN';
    const ageMs = Date.now() - frameDate.getTime();
    const ageMinutes = ageMs / (1000 * 60);

    if (ageMinutes < 0) return 'UNKNOWN'; // future time not allowed for observed radar
    if (ageMinutes <= 30) return 'FRESH';
    if (ageMinutes <= 90) return 'DELAYED';
    return 'STALE';
  } catch {
    return 'UNKNOWN';
  }
}
