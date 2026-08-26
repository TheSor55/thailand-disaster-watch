/**
 * Domain types for Radar remote-sensing observations (Phase 3.4 & Phase 3.5)
 *
 * Classification: OBSERVED_REMOTE_SENSING only.
 * Radar data represents recent sensor observations; it is NOT an official warning,
 * model forecast, or nowcast.
 *
 * RADAR GOVERNANCE REVIEW (Phase 3.5):
 * Freshness thresholds below are defined under INTERNAL_PREVIEW_POLICY based on
 * the provider's typical ~10-minute scan cadence. They are NOT an official SLA
 * guaranteed by RainViewer.
 */

export type RadarClassification = 'OBSERVED_REMOTE_SENSING';

export type RadarFreshness = 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';

export type RadarFrameStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'DEMO';

export type RadarFreshnessPolicy = 'INTERNAL_PREVIEW_POLICY';

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
  freshnessPolicy?: RadarFreshnessPolicy;
  status: RadarFrameStatus;
}

export interface RadarMetadataResponse {
  provider: string;
  generatedAt: string;
  mode: 'DEMO' | 'LIVE';
  frames: RadarFrame[];
  sourceAgreement: 'NOT_APPLICABLE';
  limitations: string[];
  freshnessPolicy: RadarFreshnessPolicy;
}

export interface RadarLayerState {
  enabled: boolean;
  opacity: number; // 0.0 to 1.0
  selectedFrameIndex: number;
  isPlaying: boolean;
}

/**
 * Calculates freshness based on frame timestamp age under INTERNAL_PREVIEW_POLICY.
 *
 * Thresholds:
 * - <= 30 mins: FRESH (typically within 3 scan cycles)
 * - <= 90 mins: DELAYED
 * - > 90 mins: STALE
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
