import type { RidErrorCode } from './types';

export class RidProviderError extends Error {
  constructor(
    readonly code: RidErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'RidProviderError';
  }
}

export function errorForUpstreamStatus(status: number): RidProviderError {
  if (status === 404) {
    return new RidProviderError('NO_DATA', 404, 'No RID telemetry data found');
  }
  if (status === 408 || status === 504) {
    return new RidProviderError('TIMEOUT', 504, 'RID upstream request timed out');
  }
  return new RidProviderError('RID_UNAVAILABLE', 502, 'RID data service temporarily unavailable');
}
