import { describe, expect, it } from 'vitest';
import {
  circuitStateFor,
  deriveApplicationConnectivityMode,
  retryDelayMs,
  type ProviderHealthRecord,
  type ProviderReliabilityPolicy,
} from './providerHealth';

const health = (status: ProviderHealthRecord['status']): ProviderHealthRecord => ({
  providerId: status.toLowerCase(),
  status,
  lastSuccessAt: null,
  lastFailureAt: null,
  latencyMs: null,
  consecutiveFailures: status === 'HEALTHY' ? 0 : 1,
  freshness: 'UNKNOWN',
});

const policy: ProviderReliabilityPolicy = {
  timeoutMs: 10_000,
  maxRetries: 3,
  baseBackoffMs: 500,
  maxBackoffMs: 2_000,
  failureThreshold: 3,
  recoveryProbeAfterMs: 30_000,
};

describe('provider health', () => {
  it.each(['HEALTHY', 'DEGRADED', 'UNAVAILABLE', 'DISABLED'] as const)(
    'retains the %s state without credentials',
    (status) => expect(health(status).status).toBe(status),
  );

  it('derives online, degraded, and offline application modes', () => {
    expect(deriveApplicationConnectivityMode([health('HEALTHY')], true)).toBe('ONLINE');
    expect(
      deriveApplicationConnectivityMode(
        [health('HEALTHY'), health('UNAVAILABLE')],
        true,
      ),
    ).toBe('DEGRADED');
    expect(deriveApplicationConnectivityMode([health('HEALTHY')], false)).toBe('OFFLINE');
  });

  it('uses configurable exponential backoff and circuit recovery probes', () => {
    expect(retryDelayMs(1, policy)).toBe(500);
    expect(retryDelayMs(3, policy)).toBe(2_000);
    expect(retryDelayMs(4, policy)).toBeNull();
    expect(circuitStateFor(2, 0, 1_000, policy)).toBe('CLOSED');
    expect(circuitStateFor(3, 0, 10_000, policy)).toBe('OPEN');
    expect(circuitStateFor(3, 0, 30_000, policy)).toBe('HALF_OPEN');
  });
});
