/**
 * RadarIntelligenceCard — Phase 3.5
 *
 * Section B: Radar Observation (RainViewer · OBSERVED_REMOTE_SENSING)
 *
 * Requirements:
 * - Semantic classification: OBSERVED_REMOTE_SENSING only
 * - Shows scan timestamp formatted in Thai
 * - Interactive frame scrubber / selector
 * - Mandatory RainViewer attribution with external link
 * - Coverage gap note (COVERAGE MAY BE INCOMPLETE)
 * - Link to GIS Map
 * - Strict failure isolation
 * - Strictly NO nowcasting, NO rain arrival ETA, NO storm speed/direction
 */

import { useState } from 'react';
import type { RadarFrame, RadarLoadState } from '../../services/radar';

interface RadarIntelligenceCardProps {
  radarState: RadarLoadState;
  onNavigateToMap?: () => void;
}

function formatScanTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('th-TH', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function RadarIntelligenceCard({
  radarState,
  onNavigateToMap,
}: RadarIntelligenceCardProps) {
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);

  if (radarState.status === 'LOADING' || radarState.status === 'IDLE') {
    return (
      <article className="weather-card weather-card--radar is-loading" aria-label="เรดาร์ตรวจอากาศสังเกตการณ์">
        <div className="weather-card__header">
          <span className="eyebrow">OBSERVED REMOTE SENSING</span>
          <span className="status-chip status-chip--small">กำลังโหลด…</span>
        </div>
        <div className="weather-card__loading">กำลังดึงข้อมูลภาพเรดาร์สังเกตการณ์…</div>
      </article>
    );
  }

  if (radarState.status === 'RADAR_UNAVAILABLE' || radarState.status === 'ERROR') {
    return (
      <article className="weather-card weather-card--radar is-unavailable" aria-label="เรดาร์ตรวจอากาศสังเกตการณ์">
        <div className="weather-card__header">
          <span className="eyebrow">OBSERVED REMOTE SENSING</span>
          <span className="status-chip status-chip--small status-chip--unavailable">UNAVAILABLE</span>
        </div>
        <div className="weather-card__body">
          <h3 className="weather-card__title">🌤 ภาพเรดาร์ตรวจอากาศ (Radar)</h3>
          <p className="weather-card__desc text-muted">
            {radarState.status === 'RADAR_UNAVAILABLE'
              ? radarState.message
              : 'ไม่สามารถเชื่อมต่อข้อมูลเรดาร์ได้ในขณะนี้'}
          </p>
          <div className="weather-card__meta">
            <small>แหล่งข้อมูล: RainViewer · ข้อมูลภาพระยะไกลไม่พร้อมใช้งาน</small>
          </div>
        </div>
      </article>
    );
  }

  const frames = radarState.data.frames;
  const activeIndex = Math.min(selectedFrameIndex, frames.length - 1);
  const currentFrame: RadarFrame | undefined = frames[activeIndex];

  return (
    <article className="weather-card weather-card--radar" aria-label="เรดาร์ตรวจอากาศสังเกตการณ์">
      <div className="weather-card__header">
        <div>
          <span className="eyebrow">OBSERVED REMOTE SENSING</span>
          <h3 className="weather-card__title">🌤 ภาพเรดาร์สังเกตการณ์ (Radar)</h3>
        </div>
        <span className={`status-chip status-chip--small status-chip--${radarState.status === 'DEMO' ? 'demo' : 'live'}`}>
          {radarState.status === 'DEMO' ? 'DEMO PREVIEW' : 'CONTROLLED LIVE'}
        </span>
      </div>

      <div className="weather-card__body">
        <div className="radar-intel-scan-box">
          <div className="radar-intel-scan-time">
            <span className="radar-intel-label">เวลาบันทึกภาพเรดาร์ (Scan Time):</span>
            <strong className="radar-intel-timestamp">{formatScanTime(currentFrame?.frameTime)}</strong>
          </div>
          <span className="radar-intel-counter">
            เฟรม {activeIndex + 1} / {frames.length}
          </span>
        </div>

        {/* Timeline Frame Selector */}
        {frames.length > 1 && (
          <div className="radar-intel-scrubber" role="group" aria-label="เลือกช่วงเวลาเฟรมเรดาร์">
            {frames.map((frame, idx) => (
              <button
                key={frame.frameId}
                type="button"
                className={`radar-intel-tick ${idx === activeIndex ? 'is-active' : ''}`}
                onClick={() => setSelectedFrameIndex(idx)}
                aria-label={`เลือกเฟรมเวลา ${formatScanTime(frame.frameTime)}`}
                aria-pressed={idx === activeIndex}
                title={formatScanTime(frame.frameTime)}
              />
            ))}
          </div>
        )}

        <p className="radar-intel-note">
          ภาพสะท้อนคลื่นเรดาร์สังเกตการณ์ฝนล่าสุด (Composite Reflectance Mosaic)
        </p>

        {onNavigateToMap && (
          <button
            type="button"
            className="radar-intel-map-btn"
            onClick={onNavigateToMap}
            aria-label="เปิดดูภาพเรดาร์บนแผนที่ GIS"
          >
            🗺 เปิดดูบนแผนที่ GIS (View on GIS Map)
          </button>
        )}

        <div className="radar-intel-footer">
          <p className="radar-intel-attribution">
            แหล่งข้อมูล: <strong>{currentFrame?.provider || 'RainViewer'}</strong> ·{' '}
            <a
              href={currentFrame?.attributionUrl || 'https://www.rainviewer.com/'}
              target="_blank"
              rel="noopener noreferrer"
              className="radar-intel-attribution-link"
            >
              Weather radar data by RainViewer
            </a>
          </p>
          <p className="radar-intel-warning">
            ⚠ {currentFrame?.coverageNote || 'COVERAGE MAY BE INCOMPLETE'} (ความครอบคลุมอาจมีช่องว่างในบางพื้นที่)
          </p>
          <p className="radar-intel-disclaimer">
            ข้อมูลสังเกตการณ์ระยะไกลสำหรับการทดสอบพัฒนา (Development Preview) ไม่ใช่คำเตือนภัยทางการ และไม่มีการคาดการณ์ Nowcasting
          </p>
        </div>
      </div>
    </article>
  );
}
