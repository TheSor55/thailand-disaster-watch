export type RainViewerErrorCode =
  | 'RADAR_PREVIEW_DISABLED'
  | 'RAINVIEWER_PILOT_DISABLED'
  | 'RAINVIEWER_FETCH_FAILED'
  | 'RAINVIEWER_INVALID_RESPONSE'
  | 'RAINVIEWER_UNAVAILABLE'
  | 'NO_FRAMES_AVAILABLE';

export class RainViewerProviderError extends Error {
  constructor(
    public readonly code: RainViewerErrorCode,
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'RainViewerProviderError';
  }
}
