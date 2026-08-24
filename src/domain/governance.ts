export const DATA_CLASSIFICATIONS = [
  'PUBLIC',
  'INTERNAL',
  'CONFIDENTIAL',
  'RESTRICTED',
] as const;

export type DataClassification = (typeof DATA_CLASSIFICATIONS)[number];

export type FreshnessState =
  | 'FRESH'
  | 'DELAYED'
  | 'STALE'
  | 'UNKNOWN'
  | 'UNAVAILABLE';

export type ConflictState =
  | 'CONSISTENT'
  | 'PARTIAL_AGREEMENT'
  | 'CONFLICT'
  | 'INSUFFICIENT_DATA';
export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
export type SystemMode = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'EXERCISE';
export type HazardType =
  | 'FLOOD'
  | 'HEAVY_RAIN'
  | 'RIVER'
  | 'DAM'
  | 'STORM'
  | 'EARTHQUAKE'
  | 'TSUNAMI'
  | 'LANDSLIDE'
  | 'DROUGHT'
  | 'WILDFIRE'
  | 'OTHER';
export type IncidentLifecycle =
  | 'DETECTED'
  | 'MONITORING'
  | 'ESCALATED'
  | 'BCM_REVIEW'
  | 'ACTIVATED_BY_HUMAN'
  | 'STABILIZED'
  | 'RECOVERY'
  | 'CLOSED'
  | 'POST_INCIDENT_REVIEW';

export type DataKind =
  | 'OBSERVED'
  | 'FORECAST'
  | 'MODEL'
  | 'OFFICIAL_WARNING'
  | 'SYSTEM_ADVISORY'
  | 'BCM_RECOMMENDATION';

export type SourceAuthority =
  | 'OFFICIAL_WARNING'
  | 'OFFICIAL_OBSERVATION'
  | 'VERIFIED_MODEL'
  | 'SYSTEM_ADVISORY'
  | 'AI_SUMMARY';

export type ProviderProductionStatus =
  | 'APPROVED'
  | 'APPROVED_WITH_CONDITIONS'
  | 'PENDING'
  | 'RESTRICTED'
  | 'UNKNOWN'
  | 'REJECTED';

export interface FreshnessPolicy {
  delayedAfterMs: number;
  staleAfterMs: number;
}

export interface FreshnessInput {
  observedAt: string | null;
  now: string;
  sourceAvailable: boolean;
}

export interface GovernedRecord<T> {
  value: T;
  unit: string | null;
  classification: DataClassification;
  authority: SourceAuthority;
  confidence: Confidence;
  conflictState: ConflictState;
  freshness: FreshnessState;
  source: {
    id: string;
    name: string;
    attribution: string;
    productionStatus: ProviderProductionStatus;
  };
  observedAt: string | null;
  receivedAt: string;
}

const SOURCE_AUTHORITY_RANK: Record<SourceAuthority, number> = {
  OFFICIAL_WARNING: 5,
  OFFICIAL_OBSERVATION: 4,
  VERIFIED_MODEL: 3,
  SYSTEM_ADVISORY: 2,
  AI_SUMMARY: 1,
};

export function compareSourceAuthority(
  left: SourceAuthority,
  right: SourceAuthority,
): number {
  return SOURCE_AUTHORITY_RANK[left] - SOURCE_AUTHORITY_RANK[right];
}

export function evaluateFreshness(
  input: FreshnessInput,
  policy: FreshnessPolicy,
): FreshnessState {
  if (!input.sourceAvailable) return 'UNAVAILABLE';
  if (!input.observedAt) return 'UNKNOWN';
  if (
    !Number.isFinite(policy.delayedAfterMs) ||
    !Number.isFinite(policy.staleAfterMs) ||
    policy.delayedAfterMs < 0 ||
    policy.staleAfterMs <= policy.delayedAfterMs
  ) {
    return 'UNKNOWN';
  }

  const observedAt = Date.parse(input.observedAt);
  const now = Date.parse(input.now);
  if (!Number.isFinite(observedAt) || !Number.isFinite(now) || observedAt > now) {
    return 'UNKNOWN';
  }

  const ageMs = now - observedAt;
  if (ageMs >= policy.staleAfterMs) return 'STALE';
  if (ageMs >= policy.delayedAfterMs) return 'DELAYED';
  return 'FRESH';
}
