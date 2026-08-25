import type { EgatErrorCode } from './types';

export class EgatProviderError extends Error {
  constructor(
    readonly code: EgatErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'EgatProviderError';
  }
}
