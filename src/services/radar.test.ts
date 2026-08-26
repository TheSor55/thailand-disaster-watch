import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchRadarFramesUI, getDemoRadarFrames } from './radar';

describe('Radar UI Service Adapter (Phase 3.4)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getDemoRadarFrames', () => {
    it('returns 6 deterministic simulation frames with required semantics', () => {
      const result = getDemoRadarFrames();
      expect(result.mode).toBe('DEMO');
      expect(result.frames.length).toBe(6);
      expect(result.frames[0].status).toBe('DEMO');
      expect(result.frames[0].classification).toBe('OBSERVED_REMOTE_SENSING');
      expect(result.frames[0].coverageNote).toBe('COVERAGE MAY BE INCOMPLETE');
      expect(result.frames[0].attribution).toContain('RainViewer');
    });
  });

  describe('fetchRadarFramesUI in DEMO mode', () => {
    it('returns demo frames without throwing even if worker endpoint is unreachable', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
      const state = await fetchRadarFramesUI('DEMO');
      expect(state.status).toBe('DEMO');
      if (state.status === 'DEMO') {
        expect(state.data.frames.length).toBe(6);
      }
    });

    it('returns worker demo response when worker returns 200', async () => {
      const mockPayload = getDemoRadarFrames();
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify(mockPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const state = await fetchRadarFramesUI('DEMO');
      expect(state.status).toBe('DEMO');
      if (state.status === 'DEMO') {
        expect(state.data.provider).toBe(mockPayload.provider);
      }
    });
  });

  describe('fetchRadarFramesUI in LIVE mode', () => {
    it('returns RADAR_UNAVAILABLE when worker returns 503 disabled error (no silent demo fallback)', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'RADAR_PREVIEW_DISABLED',
              message: 'Radar Preview is disabled by environment configuration',
            },
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        ),
      );

      const state = await fetchRadarFramesUI('LIVE');
      expect(state.status).toBe('RADAR_UNAVAILABLE');
      if (state.status === 'RADAR_UNAVAILABLE') {
        expect(state.code).toBe('RADAR_PREVIEW_DISABLED');
        expect(state.message).toContain('Radar Preview is disabled');
      }
    });

    it('returns AVAILABLE when worker returns 200 with live frames', async () => {
      const mockPayload = {
        provider: 'RainViewer',
        generatedAt: new Date().toISOString(),
        mode: 'LIVE',
        frames: [
          {
            provider: 'RainViewer',
            frameId: '1740000000',
            frameTime: new Date().toISOString(),
            retrievedAt: new Date().toISOString(),
            tileUrl: 'https://tilecache.rainviewer.com/v2/radar/1740000000/256/{z}/{x}/{y}/2/1_1.png',
            coverage: 'THAILAND_AND_GLOBAL_MOSAIC',
            coverageNote: 'COVERAGE MAY BE INCOMPLETE',
            attribution: 'Weather radar data by RainViewer',
            attributionUrl: 'https://www.rainviewer.com/',
            classification: 'OBSERVED_REMOTE_SENSING',
            freshness: 'FRESH',
            status: 'AVAILABLE',
          },
        ],
        sourceAgreement: 'NOT_APPLICABLE',
        limitations: [],
      };

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify(mockPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const state = await fetchRadarFramesUI('LIVE');
      expect(state.status).toBe('AVAILABLE');
      if (state.status === 'AVAILABLE') {
        expect(state.data.frames.length).toBe(1);
      }
    });
  });
});
