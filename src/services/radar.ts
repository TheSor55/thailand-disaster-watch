/**
 * Radar UI Service Adapter — Phase 3.4
 *
 * Provides client interface for /api/radar/frames endpoint.
 * React components must consume radar metadata through this adapter only.
 *
 * Strict safety rules:
 * - Direct browser requests to external radar providers are strictly prohibited.
 * - DEMO mode returns labeled synthetic fixtures.
 * - LIVE mode calls Worker gateway /api/radar/frames.
 * - If LIVE fails or is disabled, returns RADAR_UNAVAILABLE (no silent demo fallback).
 */

import type { RadarFrame, RadarMetadataResponse } from '../domain/radar';

export type { RadarFrame, RadarMetadataResponse };

export type RadarMode = 'DEMO' | 'LIVE';

export type RadarLoadState =
  | { status: 'IDLE' }
  | { status: 'LOADING' }
  | { status: 'DEMO'; data: RadarMetadataResponse }
  | { status: 'AVAILABLE'; data: RadarMetadataResponse }
  | { status: 'RADAR_UNAVAILABLE'; message: string; code?: string }
  | { status: 'ERROR'; message: string };

export function getDemoRadarFrames(): RadarMetadataResponse {
  const now = Date.now();
  const retrievedAt = new Date(now).toISOString();
  const frames: RadarFrame[] = [];

  for (let i = 5; i >= 0; i--) {
    const frameTimeMs = now - i * 10 * 60 * 1000;
    const frameDate = new Date(frameTimeMs);
    const frameEpoch = Math.floor(frameTimeMs / 1000);

    frames.push({
      provider: 'Demo Fixture',
      frameId: `demo_${frameEpoch}`,
      frameTime: frameDate.toISOString(),
      retrievedAt,
      tileUrl: `https://tilecache.rainviewer.com/v2/radar/${frameEpoch}/256/{z}/{x}/{y}/2/1_1.png`,
      coverage: 'THAILAND_AND_GLOBAL_MOSAIC',
      coverageNote: 'COVERAGE MAY BE INCOMPLETE',
      attribution: 'Weather radar data by RainViewer (Demo Mode)',
      attributionUrl: 'https://www.rainviewer.com/',
      classification: 'OBSERVED_REMOTE_SENSING',
      freshness: i <= 2 ? 'FRESH' : 'DELAYED',
      status: 'DEMO',
    });
  }

  return {
    provider: 'RainViewer (Demo Mode)',
    generatedAt: retrievedAt,
    mode: 'DEMO',
    frames,
    sourceAgreement: 'NOT_APPLICABLE',
    limitations: [
      'DEMO PREVIEW: Simulates recent radar observations.',
      'Not connected to live radar feed in this mode.',
      'Not an official storm warning.',
    ],
    freshnessPolicy: 'INTERNAL_PREVIEW_POLICY',
  };
}

export async function fetchRadarFramesUI(
  mode: RadarMode = 'DEMO',
  signal?: AbortSignal,
): Promise<RadarLoadState> {
  if (mode === 'DEMO') {
    try {
      const res = await fetch('/api/radar/frames?mode=DEMO', { signal });
      if (res.ok) {
        const data = (await res.json()) as RadarMetadataResponse;
        return { status: 'DEMO', data };
      }
    } catch {
      /* fallback to local demo fixture if worker not running */
    }
    return { status: 'DEMO', data: getDemoRadarFrames() };
  }

  // LIVE mode
  try {
    const res = await fetch('/api/radar/frames?mode=LIVE', { signal });
    if (res.status === 503 || res.status === 502) {
      let errorJson: { error?: { message?: string; code?: string } } = {};
      try {
        errorJson = (await res.json()) as typeof errorJson;
      } catch {
        /* empty */
      }
      return {
        status: 'RADAR_UNAVAILABLE',
        message:
          errorJson.error?.message ||
          'ระบบแสดงผลเรดาร์สดถูกปิดอยู่ตามมาตรฐานความปลอดภัย (RADAR_PREVIEW_ENABLED=false)',
        code: errorJson.error?.code,
      };
    }

    if (!res.ok) {
      return {
        status: 'ERROR',
        message: `HTTP Error ${res.status}: ไม่สามารถเรียกข้อมูลเรดาร์ได้`,
      };
    }

    const data = (await res.json()) as RadarMetadataResponse;
    return { status: 'AVAILABLE', data };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { status: 'LOADING' };
    }
    return {
      status: 'ERROR',
      message: `ไม่สามารถเชื่อมต่อ Worker Gateway: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
