/**
 * TimeAlignmentMatrix — Phase 3.5
 *
 * Section E: Time Alignment
 *
 * Displays exact observation, radar, and model forecast timestamps alongside
 * their relative temporal delta minutes compared to the reference assessment time.
 *
 * Strict invariants:
 * - Shows exact original timestamps; never invents interpolated timestamps.
 * - Displays relative delta in minutes (e.g. "-10m", "-5m", "+60m").
 */

import type { SituationTimeContext } from '../../domain/intelligence';

interface TimeAlignmentMatrixProps {
  timeContext: SituationTimeContext;
}

function formatTimeOnly(iso: string | null): string {
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

function formatDelta(deltaMin: number | null): string {
  if (deltaMin === null) return '—';
  if (deltaMin === 0) return 'ตรงเวลา (Now)';
  if (deltaMin > 0) return `+${deltaMin} นาที (อนาคต)`;
  return `${deltaMin} นาที (ย้อนหลัง)`;
}

export function TimeAlignmentMatrix({ timeContext }: TimeAlignmentMatrixProps) {
  return (
    <section className="weather-intel-section" aria-label="การเทียบเวลาอ้างอิงของแต่ละแหล่งข้อมูล">
      <div className="weather-intel-section__header">
        <span className="eyebrow">TIME ALIGNMENT &amp; TEMPORAL PROXIMITY</span>
        <h3 className="weather-intel-section__title">⏱ ตารางเทียบเวลาอ้างอิงของแต่ละแหล่งข้อมูล (Time Alignment)</h3>
        <p className="weather-intel-section__subtitle">
          แสดงเวลาจริงของข้อมูลแต่ละแหล่งเปรียบเทียบกับเวลาอ้างอิงปัจจุบัน โดยไม่มีการสังเคราะห์ข้อมูลย้อนหลังหรือแทรกข้อมูลเทียม
        </p>
      </div>

      <div className="time-matrix-grid">
        {/* TMD Station */}
        <div className="time-matrix-card">
          <span className="time-matrix-card__source">TMD (สถานีตรวจวัด)</span>
          <span className="time-matrix-card__class">OBSERVED</span>
          <strong className="time-matrix-card__time">{formatTimeOnly(timeContext.observedTime)}</strong>
          <span className="time-matrix-card__delta">{formatDelta(timeContext.observedDeltaMinutes)}</span>
        </div>

        {/* RainViewer Radar */}
        <div className="time-matrix-card">
          <span className="time-matrix-card__source">RainViewer (เรดาร์)</span>
          <span className="time-matrix-card__class">OBSERVED_REMOTE_SENSING</span>
          <strong className="time-matrix-card__time">{formatTimeOnly(timeContext.radarFrameTime)}</strong>
          <span className="time-matrix-card__delta">{formatDelta(timeContext.radarDeltaMinutes)}</span>
        </div>

        {/* Open-Meteo +1h */}
        <div className="time-matrix-card">
          <span className="time-matrix-card__source">Open-Meteo (+1h)</span>
          <span className="time-matrix-card__class">MODEL_FORECAST</span>
          <strong className="time-matrix-card__time">{formatTimeOnly(timeContext.forecast1hValidTime)}</strong>
          <span className="time-matrix-card__delta">{formatDelta(timeContext.forecast1hDeltaMinutes)}</span>
        </div>

        {/* Open-Meteo +3h */}
        <div className="time-matrix-card">
          <span className="time-matrix-card__source">Open-Meteo (+3h)</span>
          <span className="time-matrix-card__class">MODEL_FORECAST</span>
          <strong className="time-matrix-card__time">{formatTimeOnly(timeContext.forecast3hValidTime)}</strong>
          <span className="time-matrix-card__delta">{formatDelta(timeContext.forecast3hDeltaMinutes)}</span>
        </div>
      </div>
    </section>
  );
}
