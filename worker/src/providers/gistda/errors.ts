import type { GistdaErrorCode } from './types';

export class GistdaProviderError extends Error {
  constructor(
    readonly code: GistdaErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'GistdaProviderError';
  }
}

export function errorForUpstreamStatus(status: number): GistdaProviderError {
  if (status === 401 || status === 407) {
    return new GistdaProviderError(
      'AUTHENTICATION_FAILED',
      502,
      'GISTDA authentication failed',
    );
  }
  if (status === 429) {
    return new GistdaProviderError('RATE_LIMITED', 503, 'GISTDA rate limited');
  }
  if (status === 404) {
    return new GistdaProviderError('NO_DATA', 404, 'No GISTDA tile data');
  }
  return new GistdaProviderError(
    'GISTDA_UNAVAILABLE',
    503,
    'GISTDA data temporarily unavailable',
  );
}
