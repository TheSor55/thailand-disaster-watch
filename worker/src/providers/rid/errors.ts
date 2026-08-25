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
