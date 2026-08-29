/**
 * ObservedWeatherCard — Card A: ตรวจสอบกลุ่มฝนสังเกตการณ์สด & เรดาร์ประจำพื้นที่
 *
 * STRICT RULE: Uses OBSERVED and REMOTE SENSING data.
 * Eliminates misleading static single-sensor conclusions.
 * Directly links with Regional Radar Network (BMA Nong Khaem, Chai Nat, Lamphun, Khon Kaen, etc.)
 * and Enterprise My Sites.
 */

import { FreshnessBar } from './FreshnessBar';
import type { WeatherSituationObserved } from '../../domain/weather';
import { getNearestRegionalRadar } from '../../domain/regionalRadar';

interface ObservedWeatherCardProps {
  observed: WeatherSituationObserved | null;
  loading?: boolean;
  latitude?: number;
  longitude?: number;
  locationLabel?: string | null;
  onNavigateToRadar?: () => void;
  onNavigateToMySites?: () => void;
}

function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return ts;
  }
}

function MetricRow({ label, value, unit }: { label: string; value: number | null | undefined; unit: string }) {
  return (
    <div className="weather-metric">
      <span className="weather-metric__label">{label}</span>
      <span className="weather-metric__value">
        {value != null ? `${value} ${unit}` : <span className="weather-metric__na">—</span>}
      </span>
    </div>
  );
}

export function ObservedWeatherCard({
  observed,
  loading = false,
  latitude = 13.7563,
  longitude = 100.5018,
  locationLabel,
  onNavigateToRadar,
  onNavigateToMySites,
}: ObservedWeatherCardProps) {
  const nearest = getNearestRegionalRadar(latitude, longitude);

  if (loading) {
    return (
      <article className="weather-card weather-card--observed weather-card--loading" aria-busy="true" aria-label="กำลังโหลดข้อมูลสังเกตการณ์">
        <div className="weather-card__header">
          <span className="eyebrow">OBSERVED & RADAR</span>
          <h3>ตอนนี้ (สังเกตการณ์ & เรดาร์)</h3>
        </div>
        <div className="weather-card__loading-skeleton" aria-hidden="true" />
      </article>
    );
  }

  if (!observed) {
    return (
      <article className="weather-card weather-card--observed weather-card--unavailable" aria-label="ข้อมูลสังเกตการณ์ไม่พร้อมใช้งาน">
        <div className="weather-card__header">
          <span className="classification-badge classification-badge--observed">OBSERVED</span>
          <h3>ตอนนี้ (สังเกตการณ์)</h3>
        </div>
        <p className="weather-card__unavailable-msg">
          ไม่สามารถรับข้อมูลสภาพอากาศจากแหล่งที่ตรวจสอบได้ในขณะนี้
        </p>
        <p className="weather-card__source-note">แหล่งข้อมูล: TMD · ประเภท: OBSERVED</p>
      </article>
    );
  }

  return (
    <article className="weather-card weather-card--observed" aria-label="สภาพอากาศปัจจุบัน (สังเกตการณ์และเรดาร์สด)">
      <div className="weather-card__header">
        <div>
          <span className="classification-badge classification-badge--observed">OBSERVED & RADAR</span>
          <h3 style={{ margin: '2px 0', fontSize: '1rem' }}>ตอนนี้ (สังเกตการณ์สด & เรดาร์)</h3>
        </div>
        <FreshnessBar freshness={observed.freshness} compact />
      </div>

      {/* Primary answer: Real-Time Radar & Telemetry Integration */}
      <div className="weather-card__primary-answer" aria-label="สถานะตรวจจับกลุ่มฝนจากเรดาร์">
        <span className="weather-card__question" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          สถานีเรดาร์ตรวจฝนประจำพื้นที่ครอบคลุม:
        </span>

        {/* Dynamic Regional Radar Match Box */}
        <div
          style={{
            marginTop: '6px',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(24, 38, 66, 0.8))',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '8px',
            padding: '10px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>📡</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                <strong style={{ fontSize: '0.85rem', color: '#38bdf8' }}>
                  {nearest.radar.nameTh}
                </strong>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontSize: '0.62rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  รัศมี {nearest.radar.rangeKm} กม.
                </span>
              </div>
              <small style={{ color: '#cbd5e1', fontSize: '0.68rem', display: 'block', marginTop: '2px' }}>
                📍 ระยะห่างจากจุดตรวจนี้: <strong>~{nearest.distanceKm} กม.</strong> · ครอบคลุม: {nearest.radar.coverageTh}
              </small>
            </div>
          </div>

          {/* Quick Action Links inside the Box */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
            {onNavigateToRadar && (
              <button
                type="button"
                onClick={onNavigateToRadar}
                style={{
                  flex: 1,
                  minWidth: '140px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid #38bdf8',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span>🌧️</span>
                <span>เปิดดูเรดาร์ตรวจฝนสด ↗</span>
              </button>
            )}

            {onNavigateToMySites && (
              <button
                type="button"
                onClick={onNavigateToMySites}
                style={{
                  flex: 1,
                  minWidth: '140px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span>🏢</span>
                <span>ตรวจสอบ My Sites (33 แห่ง) ↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="weather-card__metrics">
        <MetricRow label="อุณหภูมิภาคพื้นดิน" value={observed.temperatureCelsius} unit="°C" />
        <MetricRow label="ความชื้นสัมพัทธ์" value={observed.humidityPercent} unit="%" />
        <MetricRow label="ความเร็วลม" value={observed.windSpeedKph} unit="กม./ชม." />
      </div>

      <footer className="weather-card__footer">
        <dl className="weather-card__meta">
          <div><dt>หน่วยงานเรดาร์</dt><dd>{nearest.radar.agency} ({nearest.radar.nameTh})</dd></div>
          <div><dt>พิกัดที่ตรวจ</dt><dd>{locationLabel ?? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}</dd></div>
          <div><dt>เวลาสังเกตการณ์</dt><dd>{formatTimestamp(observed.observedAt)}</dd></div>
        </dl>
      </footer>
    </article>
  );
}
