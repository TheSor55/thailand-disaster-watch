import {
  circuitStateFor,
  retryDelayMs,
  type ProviderReliabilityPolicy,
} from '../domain/providerHealth';

export type ProviderOperation<T> = (
  signal: AbortSignal,
  attempt: number,
) => Promise<T>;

interface CircuitRecord {
  consecutiveFailures: number;
  lastFailureAtMs: number | null;
}

export interface ProviderReliabilityDependencies {
  now?: () => number;
  wait?: (delayMs: number) => Promise<void>;
}

export class ProviderCircuitOpenError extends Error {
  constructor() {
    super('PROVIDER_CIRCUIT_OPEN');
    this.name = 'ProviderCircuitOpenError';
  }
}

export class ProviderRequestCoordinator {
  private readonly inFlight = new Map<string, Promise<unknown>>();
  private readonly controllers = new Map<string, AbortController>();
  private readonly circuits = new Map<string, CircuitRecord>();
  private readonly now: () => number;
  private readonly wait: (delayMs: number) => Promise<void>;

  constructor(
    private readonly policy: ProviderReliabilityPolicy,
    dependencies: ProviderReliabilityDependencies = {},
  ) {
    this.now = dependencies.now ?? Date.now;
    this.wait = dependencies.wait ?? ((delayMs) => new Promise((resolve) => {
      window.setTimeout(resolve, delayMs);
    }));
  }

  execute<T>(requestKey: string, operation: ProviderOperation<T>): Promise<T> {
    const existing = this.inFlight.get(requestKey) as Promise<T> | undefined;
    if (existing) return existing;

    const circuit = this.circuits.get(requestKey) ?? {
      consecutiveFailures: 0,
      lastFailureAtMs: null,
    };
    if (
      circuitStateFor(
        circuit.consecutiveFailures,
        circuit.lastFailureAtMs,
        this.now(),
        this.policy,
      ) === 'OPEN'
    ) {
      return Promise.reject(new ProviderCircuitOpenError());
    }

    const controller = new AbortController();
    this.controllers.set(requestKey, controller);
    const request = this.runWithRetry(requestKey, operation, controller)
      .finally(() => {
        this.inFlight.delete(requestKey);
        this.controllers.delete(requestKey);
      });
    this.inFlight.set(requestKey, request);
    return request;
  }

  cancel(requestKey: string): void {
    this.controllers.get(requestKey)?.abort('REQUEST_CANCELLED');
  }

  private async runWithRetry<T>(
    requestKey: string,
    operation: ProviderOperation<T>,
    controller: AbortController,
  ): Promise<T> {
    for (let attempt = 1; ; attempt += 1) {
      try {
        const result = await this.runWithTimeout(operation, controller, attempt);
        this.circuits.set(requestKey, { consecutiveFailures: 0, lastFailureAtMs: null });
        return result;
      } catch (error) {
        const circuit = this.circuits.get(requestKey) ?? {
          consecutiveFailures: 0,
          lastFailureAtMs: null,
        };
        this.circuits.set(requestKey, {
          consecutiveFailures: circuit.consecutiveFailures + 1,
          lastFailureAtMs: this.now(),
        });
        const delay = retryDelayMs(attempt, this.policy);
        if (controller.signal.aborted || delay === null) throw error;
        await this.wait(delay);
      }
    }
  }

  private async runWithTimeout<T>(
    operation: ProviderOperation<T>,
    controller: AbortController,
    attempt: number,
  ): Promise<T> {
    const timeout = window.setTimeout(
      () => controller.abort('PROVIDER_TIMEOUT'),
      this.policy.timeoutMs,
    );
    try {
      return await operation(controller.signal, attempt);
    } finally {
      window.clearTimeout(timeout);
    }
  }
}
