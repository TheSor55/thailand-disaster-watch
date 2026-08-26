/**
 * ObservedWeatherCard — Card A: ตอนนี้มีฝนไหม?
 *
 * STRICT RULE: Uses OBSERVED data ONLY.
 * Must never fall back to forecast and present it as current weather.
 * If observed precipitation is unavailable, shows explicit unavailable message.
 */

import { FreshnessBar } from './FreshnessBar';
import type { WeatherSituationObserved } from '../../domain/weather';

interface ObservedWeatherCardProps {
  observed: WeatherSituationObserved | null;
  loading?: boolean;
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

export function ObservedWeatherCard({ observed, loading = false }: ObservedWeatherCardProps) {
  if (loading) {
    return (
      <article className="weather-card weather-card--observed weather-card--loading" aria-busy="true" aria-label="กำลังโหลดข้อมูลสังเกตการณ์">
        <div className="weather-card__header">
          <span className="eyebrow">OBSERVED</span>
          <h3>ตอนนี้ (สังเกตการณ์)</h3>
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

  const hasPrecipitation = observed.precipitation != null;

  return (
    <article className="weather-card weather-card--observed" aria-label="สภาพอากาศปัจจุบัน (สังเกตการณ์)">
      <div className="weather-card__header">
        <span className="classification-badge classification-badge--observed">OBSERVED</span>
        <h3>ตอนนี้ (สังเกตการณ์)</h3>
        <FreshnessBar freshness={observed.freshness} compact />
      </div>

      {/* Primary answer: ตอนนี้มีฝนไหม? — OBSERVED ONLY */}
      <div className="weather-card__primary-answer" aria-label="ตอนนี้มีฝนไหม?">
        <span className="weather-card__question">ตอนนี้มีฝนไหม?</span>
        {hasPrecipitation ? (
          <span className="weather-card__answer weather-card__answer--data">
            {observed.precipitation! > 0
              ? `มีฝน ${observed.precipitation} มม.`
              : 'ไม่มีฝน (สังเกตการณ์จริง)'}
          </span>
        ) : (
          <span className="weather-card__answer weather-card__answer--unavailable">
            ยังไม่มีข้อมูลฝนสังเกตการณ์ที่ยืนยันได้
          </span>
        )}
      </div>

      <div className="weather-card__metrics">
        <MetricRow label="อุณหภูมิ" value={observed.temperatureCelsius} unit="°C" />
        <MetricRow label="ความชื้น" value={observed.humidityPercent} unit="%" />
        <MetricRow label="ความเร็วลม" value={observed.windSpeedKph} unit="กม./ชม." />
      </div>

      <footer className="weather-card__footer">
        <dl className="weather-card__meta">
          <div><dt>แหล่งข้อมูล</dt><dd>{observed.source}</dd></div>
          <div><dt>ประเภท</dt><dd>OBSERVED · ข้อมูลสังเกตการณ์</dd></div>
          <div><dt>เวลาสังเกตการณ์</dt><dd>{formatTimestamp(observed.observedAt)}</dd></div>
          <div><dt>ดึงข้อมูลเมื่อ</dt><dd>{formatTimestamp(observed.retrievedAt)}</dd></div>
        </dl>
      </footer>
    </article>
  );
}
