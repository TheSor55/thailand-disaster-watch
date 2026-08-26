/**
 * RadarControlPanel — Phase 3.4 & v1.1 UX Refinement
 *
 * Compact & Collapsible Floating Control Panel for the MapLibre Radar observation layer.
 *
 * Requirements:
 * - Frame timestamp display (formatted in Thai locale)
 * - Historical frame controls: Previous, Play/Pause, Next
 * - Timeline scrubbing track & Opacity slider
 * - Collapsible Mini-Player mode so it never blocks the map view
 * - Mandatory attribution ("Weather radar data by RainViewer")
 * - Non-operational development preview disclaimers
 * - Coverage gap note ("COVERAGE MAY BE INCOMPLETE")
 * - Strictly NO nowcasting or automated storm warnings
 */

import { useEffect, useCallback, useState } from 'react';
import type { RadarFrame } from '../../domain/radar';

interface RadarControlPanelProps {
  frames: RadarFrame[];
  selectedFrameIndex: number;
  onSelectFrameIndex: (index: number) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  isPlaying: boolean;
  onTogglePlay: (playing: boolean) => void;
  onClose: () => void;
  mode: 'DEMO' | 'LIVE';
}

function formatFrameTime(iso: string | null | undefined): string {
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

function formatShortTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function RadarControlPanel({
  frames,
  selectedFrameIndex,
  onSelectFrameIndex,
  opacity,
  onOpacityChange,
  isPlaying,
  onTogglePlay,
  onClose,
  mode,
}: RadarControlPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentFrame: RadarFrame | undefined = frames[selectedFrameIndex];

  const handleNext = useCallback(() => {
    if (frames.length === 0) return;
    onSelectFrameIndex((selectedFrameIndex + 1) % frames.length);
  }, [frames.length, onSelectFrameIndex, selectedFrameIndex]);

  const handlePrev = useCallback(() => {
    if (frames.length === 0) return;
    onSelectFrameIndex((selectedFrameIndex - 1 + frames.length) % frames.length);
  }, [frames.length, onSelectFrameIndex, selectedFrameIndex]);

  // Animation interval when isPlaying is true
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;
    const interval = setInterval(() => {
      onSelectFrameIndex((selectedFrameIndex + 1) % frames.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, onSelectFrameIndex, selectedFrameIndex]);

  if (frames.length === 0) {
    return null;
  }

  // Mini-player mode (Compact single-row bar)
  if (isCollapsed) {
    return (
      <div
        className="radar-control-panel radar-control-panel--mini"
        role="region"
        aria-label="แผงควบคุมเรดาร์ขนาดเล็ก"
      >
        <div className="radar-mini-row">
          <button
            type="button"
            className={`radar-btn radar-btn--play ${isPlaying ? 'is-playing' : ''}`}
            onClick={() => onTogglePlay(!isPlaying)}
            aria-label={isPlaying ? 'หยุดเล่น' : 'เล่น'}
            title={isPlaying ? 'หยุด' : 'เล่น'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            type="button"
            className="radar-btn radar-btn--small"
            onClick={handlePrev}
            aria-label="เฟรมก่อนหน้า"
            title="เฟรมก่อนหน้า"
          >
            ◀
          </button>

          <div className="radar-mini-time">
            <span className="radar-mini-time__badge">เรดาร์ {formatShortTime(currentFrame?.frameTime)}</span>
            <span className="radar-mini-time__counter">
              ({selectedFrameIndex + 1}/{frames.length})
            </span>
          </div>

          <button
            type="button"
            className="radar-btn radar-btn--small"
            onClick={handleNext}
            aria-label="เฟรมถัดไป"
            title="เฟรมถัดไป"
          >
            ▶
          </button>

          <button
            type="button"
            className="radar-btn radar-btn--expand"
            onClick={() => setIsCollapsed(false)}
            aria-label="ขยายแผงควบคุมเรดาร์"
            title="ขยายแผงควบคุม"
          >
            ⛶ ขยาย
          </button>

          <button
            type="button"
            className="radar-control-panel__close-btn"
            onClick={onClose}
            aria-label="ปิดเลเยอร์เรดาร์"
            title="ปิดเลเยอร์เรดาร์"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  // Expanded full control panel
  return (
    <div className="radar-control-panel" role="region" aria-label="แผงควบคุมเรดาร์ตรวจอากาศ">
      <div className="radar-control-panel__header">
        <div className="radar-control-panel__title-group">
          <span className="eyebrow">OBSERVED REMOTE SENSING</span>
          <h3 className="radar-control-panel__title">🌤 เรดาร์ตรวจอากาศสังเกตการณ์</h3>
        </div>
        <div className="radar-control-panel__header-actions">
          <span className={`status-chip status-chip--${mode === 'DEMO' ? 'demo' : 'dev-preview'}`}>
            {mode === 'DEMO' ? 'DEMO PREVIEW' : 'CONTROLLED LIVE'}
          </span>
          <button
            type="button"
            className="radar-btn radar-btn--collapse"
            onClick={() => setIsCollapsed(true)}
            aria-label="ย่อแผงควบคุมเรดาร์"
            title="ย่อแผงควบคุม"
          >
            — ย่อ
          </button>
          <button
            type="button"
            className="radar-control-panel__close-btn"
            onClick={onClose}
            aria-label="ปิดเลเยอร์เรดาร์"
            title="ปิดเลเยอร์เรดาร์"
          >
            ×
          </button>
        </div>
      </div>

      {/* Frame Time and Index */}
      <div className="radar-control-panel__time-display">
        <div className="radar-time-badge">
          <span className="radar-time-badge__label">เวลาภาพถ่ายเรดาร์ (Scan Time):</span>
          <strong className="radar-time-badge__value">{formatFrameTime(currentFrame?.frameTime)}</strong>
        </div>
        <span className="radar-frame-counter">
          เฟรม {selectedFrameIndex + 1} / {frames.length}
        </span>
      </div>

      {/* Playback controls */}
      <div className="radar-playback-controls" aria-label="การเล่นภาพเคลื่อนไหว">
        <button
          type="button"
          className="radar-btn"
          onClick={handlePrev}
          aria-label="เฟรมก่อนหน้า"
          title="เฟรมก่อนหน้า"
        >
          ◀
        </button>
        <button
          type="button"
          className={`radar-btn radar-btn--play ${isPlaying ? 'is-playing' : ''}`}
          onClick={() => onTogglePlay(!isPlaying)}
          aria-label={isPlaying ? 'หยุดเล่นภาพเคลื่อนไหว' : 'เล่นภาพเคลื่อนไหว'}
          title={isPlaying ? 'หยุดเล่น' : 'เล่น'}
        >
          {isPlaying ? '⏸ หยุด' : '▶ เล่น'}
        </button>
        <button
          type="button"
          className="radar-btn"
          onClick={handleNext}
          aria-label="เฟรมถัดไป"
          title="เฟรมถัดไป"
        >
          ▶
        </button>
      </div>

      {/* Timeline scrubbing track */}
      <div className="radar-timeline-track" role="group" aria-label="แถบเลือกช่วงเวลาเฟรม">
        {frames.map((frame, idx) => (
          <button
            key={frame.frameId}
            type="button"
            className={`radar-timeline-tick ${idx === selectedFrameIndex ? 'is-active' : ''}`}
            onClick={() => {
              onTogglePlay(false);
              onSelectFrameIndex(idx);
            }}
            aria-label={`เลือกเฟรมเวลา ${formatFrameTime(frame.frameTime)}`}
            aria-pressed={idx === selectedFrameIndex}
            title={formatFrameTime(frame.frameTime)}
          />
        ))}
      </div>

      {/* Opacity slider */}
      <div className="radar-opacity-control">
        <label htmlFor="radar-opacity-slider" className="radar-opacity-label">
          <span>ความโปร่งใส (Opacity):</span>
          <strong>{Math.round(opacity * 100)}%</strong>
        </label>
        <input
          id="radar-opacity-slider"
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={opacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          aria-label="ปรับความโปร่งใสของเรดาร์"
        />
      </div>

      {/* Attribution & Coverage Note */}
      <div className="radar-control-panel__footer">
        <p className="radar-attribution">
          แหล่งข้อมูล: <strong>{currentFrame?.provider || 'RainViewer'}</strong> ·{' '}
          <a
            href={currentFrame?.attributionUrl || 'https://www.rainviewer.com/'}
            target="_blank"
            rel="noopener noreferrer"
            className="radar-attribution-link"
          >
            Weather radar data by RainViewer
          </a>
        </p>
        <p className="radar-coverage-note">
          ⚠ {currentFrame?.coverageNote || 'COVERAGE MAY BE INCOMPLETE'} (ความครอบคลุมอาจมีช่องว่างในบางพื้นที่)
        </p>
        <p className="radar-disclaimer">
          ข้อมูลภาพสังเกตการณ์ระยะไกลสำหรับการทดสอบพัฒนา (Development Preview) ไม่ใช่การแจ้งเตือนภัยทางการ และไม่มีการคำนวณ Nowcasting
        </p>
      </div>
    </div>
  );
}
