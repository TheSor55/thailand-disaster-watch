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

export function errorForUpstreamStatus(status: number): TmdProviderError {
  if (status === 401 || status === 403) {
    return new TmdProviderError(
      'AUTHENTICATION_NOT_CONFIGURED',
      401,
      'TMD API credentials (UID/UKey) are invalid or unauthorized'
    );
  }
  if (status === 404) {
    return new TmdProviderError('NO_DATA', 404, 'No TMD weather observation data found');
  }
  if (status === 408 || status === 504) {
    return new TmdProviderError('TIMEOUT', 504, 'TMD upstream request timed out');
  }
  return new TmdProviderError('TMD_UNAVAILABLE', 502, 'TMD weather service temporarily unavailable');
}
