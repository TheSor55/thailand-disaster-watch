import { describe, expect, it } from 'vitest';
import { detectShareCapabilities, type NormalizedHazardEvent } from './platformContracts';

describe('platform contracts', () => {
  it('falls back when native sharing is unavailable', () => {
    expect(
      detectShareCapabilities({
        hasNavigatorShare: false,
        hasDownloadSupport: true,
        hasClipboardWrite: true,
      }),
    ).toEqual({ nativeShare: false, download: true, copySummary: true });
  });

  it('supports one normalized event associated with multiple source events', () => {
    const event: NormalizedHazardEvent = {
      id: 'event-example',
      hazard: 'EARTHQUAKE',
      occurredAt: '2026-08-24T00:00:00Z',
      latitude: 0,
      longitude: 0,
      magnitude: null,
      depthKm: null,
      sources: [
        { providerId: 'provider-a', sourceEventId: 'a', officialBulletinId: null },
        { providerId: 'provider-b', sourceEventId: 'b', officialBulletinId: null },
      ],
    };
    expect(event.sources).toHaveLength(2);
    expect(event.magnitude).toBeNull();
  });
});
