import { describe, expect, it } from 'vitest';
import { fetchRainViewerFrames, generateDemoRadarFrames, rainViewerPilotStatus } from './client';
import { RainViewerProviderError } from './errors';

describe('RainViewer Worker Provider Client (Phase 3.4)', () => {
  describe('Safety Gates', () => {
    it('is disabled by default when env flags are not set', () => {
      expect(rainViewerPilotStatus({})).toBe('DISABLED');
    });

    it('remains disabled when only RADAR_PREVIEW_ENABLED is true', () => {
      expect(rainViewerPilotStatus({ RADAR_PREVIEW_ENABLED: 'true' })).toBe('DISABLED');
    });

    it('remains disabled when only RAINVIEWER_PILOT_ENABLED is true', () => {
      expect(rainViewerPilotStatus({ RAINVIEWER_PILOT_ENABLED: 'true' })).toBe('DISABLED');
    });

    it('is enabled only when both flags are true', () => {
      expect(
        rainViewerPilotStatus({
          RADAR_PREVIEW_ENABLED: 'true',
          RAINVIEWER_PILOT_ENABLED: 'true',
        }),
      ).toBe('ENABLED');
    });

    it('rejects LIVE mode fetch requests when gates are disabled', async () => {
      await expect(
        fetchRainViewerFrames({}, { mode: 'LIVE' }),
      ).rejects.toThrowError(
        new RainViewerProviderError(
          'RADAR_PREVIEW_DISABLED',
          503,
          'Radar Preview is disabled by environment configuration (RADAR_PREVIEW_ENABLED=false)',
        ),
      );
    });
  });

  describe('DEMO Mode', () => {
    it('returns deterministic demo frames without network calls', async () => {
      const result = await fetchRainViewerFrames({}, { mode: 'DEMO' });
      expect(result.mode).toBe('DEMO');
      expect(result.provider).toContain('RainViewer (Demo Mode)');
      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.frames[0].status).toBe('DEMO');
      expect(result.frames[0].classification).toBe('OBSERVED_REMOTE_SENSING');
      expect(result.frames[0].tileUrl).toContain('{z}/{x}/{y}');
      expect(result.frames[0].coverageNote).toBe('COVERAGE MAY BE INCOMPLETE');
      expect(result.frames[0].attribution).toContain('RainViewer');
    });

    it('generates demo frames with valid ISO timestamps', () => {
      const frames = generateDemoRadarFrames();
      expect(frames.length).toBe(6);
      for (const frame of frames) {
        expect(new Date(frame.frameTime).toISOString()).toBe(frame.frameTime);
        expect(frame.frameId).toMatch(/^demo_\d+$/);
      }
    });
  });

  describe('LIVE Mode Fetch & Normalization', () => {
    const env = {
      RADAR_PREVIEW_ENABLED: 'true',
      RAINVIEWER_PILOT_ENABLED: 'true',
    };

    it('successfully parses RainViewer past radar frames and rejects nowcast', async () => {
      const nowSec = Math.floor(Date.now() / 1000);
      const mockApiResponse = {
        version: 'v2',
        generated: nowSec,
        host: 'https://tilecache.rainviewer.com',
        radar: {
          past: [
            { time: nowSec - 1800, path: `/v2/radar/${nowSec - 1800}/256` },
            { time: nowSec - 1200, path: `/v2/radar/${nowSec - 1200}/256` },
            { time: nowSec - 600, path: `/v2/radar/${nowSec - 600}/256` },
          ],
          nowcast: [
            // NOWCAST MUST BE COMPLETELY IGNORED IN PHASE 3.4
            { time: nowSec + 600, path: `/v2/radar/${nowSec + 600}/256` },
          ],
        },
      };

      const mockFetch = async () =>
        new Response(JSON.stringify(mockApiResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });

      const result = await fetchRainViewerFrames(env, { mode: 'LIVE', fetchFn: mockFetch });

      expect(result.mode).toBe('LIVE');
      expect(result.frames.length).toBe(3);
      expect(result.frames[0].frameId).toBe(String(nowSec - 1800));
      expect(result.frames[0].tileUrl).toBe(
        `https://tilecache.rainviewer.com/v2/radar/${nowSec - 1800}/256/{z}/{x}/{y}/2/1_1.png`,
      );
      expect(result.frames[0].classification).toBe('OBSERVED_REMOTE_SENSING');
      expect(result.frames[0].coverageNote).toBe('COVERAGE MAY BE INCOMPLETE');
      expect(result.frames[0].attribution).toBe('Weather radar data by RainViewer');
      expect(result.frames[0].attributionUrl).toBe('https://www.rainviewer.com/');

      // Verify nowcast frame was NOT included
      for (const frame of result.frames) {
        expect(new Date(frame.frameTime).getTime()).toBeLessThanOrEqual(Date.now());
      }
    });

    it('rejects API response with no past frames', async () => {
      const mockFetch = async () =>
        new Response(JSON.stringify({ radar: { past: [] } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });

      await expect(
        fetchRainViewerFrames(env, { mode: 'LIVE', fetchFn: mockFetch }),
      ).rejects.toThrowError(
        new RainViewerProviderError(
          'NO_FRAMES_AVAILABLE',
          502,
          'RainViewer returned no historical radar frames',
        ),
      );
    });

    it('rejects frames with missing or non-numeric timestamps', async () => {
      const mockFetch = async () =>
        new Response(
          JSON.stringify({
            host: 'https://tilecache.rainviewer.com',
            radar: {
              past: [
                { time: null, path: '/invalid' },
                { time: 'invalid', path: '/invalid2' },
              ],
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );

      await expect(
        fetchRainViewerFrames(env, { mode: 'LIVE', fetchFn: mockFetch }),
      ).rejects.toThrowError(
        new RainViewerProviderError(
          'NO_FRAMES_AVAILABLE',
          502,
          'No valid radar frames remained after timestamp validation',
        ),
      );
    });
  });
});
