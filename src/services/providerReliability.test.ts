import { describe, expect, it, vi } from 'vitest';
import type { ProviderReliabilityPolicy } from '../domain/providerHealth';
import {
  ProviderCircuitOpenError,
  ProviderRequestCoordinator,
} from './providerReliability';

const testPolicy: ProviderReliabilityPolicy = {
  timeoutMs: 100,
  maxRetries: 1,
  baseBackoffMs: 5,
  maxBackoffMs: 5,
  failureThreshold: 1,
  recoveryProbeAfterMs: 50,
};

describe('ProviderRequestCoordinator', () => {
  it('deduplicates concurrent requests and permits cancellation', async () => {
    let resolveOperation: ((value: string) => void) | undefined;
    const operation = vi.fn(
      (signal: AbortSignal) => new Promise<string>((resolve, reject) => {
        resolveOperation = resolve;
        signal.addEventListener('abort', () => reject(new Error('cancelled')));
      }),
    );
    const coordinator = new ProviderRequestCoordinator(testPolicy);
    const first = coordinator.execute('provider:dataset', operation);
    const second = coordinator.execute('provider:dataset', operation);
    expect(first).toBe(second);
    expect(operation).toHaveBeenCalledTimes(1);
    resolveOperation?.('ok');
    await expect(first).resolves.toBe('ok');

    const cancelled = coordinator.execute('provider:other', operation);
    coordinator.cancel('provider:other');
    await expect(cancelled).rejects.toThrow('cancelled');
  });

  it('retries with injected backoff and opens the circuit after failure', async () => {
    const now = vi.fn(() => 0);
    const wait = vi.fn(async () => undefined);
    const coordinator = new ProviderRequestCoordinator(testPolicy, { now, wait });
    const failure = vi.fn(async () => { throw new Error('unavailable'); });

    await expect(coordinator.execute('provider:failure', failure)).rejects.toThrow('unavailable');
    expect(failure).toHaveBeenCalledTimes(2);
    expect(wait).toHaveBeenCalledWith(5);
    await expect(
      coordinator.execute('provider:failure', failure),
    ).rejects.toBeInstanceOf(ProviderCircuitOpenError);
  });
});
