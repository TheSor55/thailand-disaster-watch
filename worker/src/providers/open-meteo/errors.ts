import type { OpenMeteoErrorCode } from './types';

export class OpenMeteoProviderError extends Error {
  constructor(
    readonly code: OpenMeteoErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'OpenMeteoProviderError';
  }
}

export function errorForUpstreamStatus(status: number): OpenMeteoProviderError {
  if (status === 400) {
    return new OpenMeteoProviderError(
      'INVALID_COORDINATES',
      400,
      'Invalid location coordinates requested'
    );
  }
  if (status === 404) {
    return new OpenMeteoProviderError('NO_DATA', 404, 'No forecast data available');
  }
  if (status === 408 || status === 504) {
    return new OpenMeteoProviderError('TIMEOUT', 504, 'Open-Meteo request timed out');
  }
  return new OpenMeteoProviderError('OPEN_METEO_UNAVAILABLE', 502, 'Open-Meteo weather service temporarily unavailable');
}
