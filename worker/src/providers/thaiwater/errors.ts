import type { ThaiWaterErrorCode } from './types';

export class ThaiWaterProviderError extends Error {
  constructor(
    readonly code: ThaiWaterErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ThaiWaterProviderError';
  }
}
