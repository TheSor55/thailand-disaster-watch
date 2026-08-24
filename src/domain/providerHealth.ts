import type { FreshnessState } from './governance';

export type ProviderHealthStatus =
  | 'HEALTHY'
  | 'DEGRADED'
  | 'UNAVAILABLE'
  | 'DISABLED'
  | 'UNKNOWN';

export interface ProviderHealthRecord {
  providerId: string;
  status: ProviderHealthStatus;
  lastSuccessAt: string | null;
  lastFailureAt: string | null;
  latencyMs: number | null;
  consecutiveFailures: number;
  freshness: FreshnessState;
}

export type ApplicationConnectivityMode = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export function deriveApplicationConnectivityMode(
  providers: readonly ProviderHealthRecord[],
  networkAvailable: boolean,
): ApplicationConnectivityMode {
  if (!networkAvailable) return 'OFFLINE';
  const enabled = providers.filter((provider) => provider.status !== 'DISABLED');
  if (enabled.length === 0) return 'DEGRADED';
  if (enabled.every((provider) => provider.status === 'HEALTHY')) return 'ONLINE';
  return 'DEGRADED';
}

export interface ProviderReliabilityPolicy {
  timeoutMs: number;
  maxRetries: number;
  baseBackoffMs: number;
  maxBackoffMs: number;
  failureThreshold: number;
  recoveryProbeAfterMs: number;
}

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export function retryDelayMs(
  attempt: number,
  policy: ProviderReliabilityPolicy,
): number | null {
  if (attempt < 1 || attempt > policy.maxRetries) return null;
  return Math.min(policy.baseBackoffMs * 2 ** (attempt - 1), policy.maxBackoffMs);
}

export function circuitStateFor(
  consecutiveFailures: number,
  lastFailureAtMs: number | null,
  nowMs: number,
  policy: ProviderReliabilityPolicy,
): CircuitState {
  if (consecutiveFailures < policy.failureThreshold) return 'CLOSED';
  if (
    lastFailureAtMs !== null &&
    nowMs - lastFailureAtMs >= policy.recoveryProbeAfterMs
  ) {
    return 'HALF_OPEN';
  }
  return 'OPEN';
}
