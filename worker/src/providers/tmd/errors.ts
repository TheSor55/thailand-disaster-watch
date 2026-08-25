import type { TmdErrorCode } from './types';

export class TmdProviderError extends Error {
  constructor(
    readonly code: TmdErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'TmdProviderError';
  }
}
