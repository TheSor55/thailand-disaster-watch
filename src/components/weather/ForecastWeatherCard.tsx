/**
 * ForecastWeatherCard — Cards B & C: อีก 1/3 ชั่วโมงมีแนวโน้มฝนไหม?
 *
 * Uses MODEL_FORECAST data only.
 * Avoids definitive wording ("ฝนจะตก").
 * Prefers probabilistic wording ("มีแนวโน้มฝน", "แบบจำลองคาดการณ์...").
 * Must NOT claim observed rain from forecast.
 */

import { FreshnessBar } from './FreshnessBar';
import type { WeatherSituationForecast } from '../../domain/weather';

interface ForecastWeatherCardProps {
  forecast: WeatherSituationForecast | null;
  horizon: '1h' | '3h';
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

const HORIZON_LABEL: Record<'1h' | '3h', { th: string; question: string }> = {
  '1h': { th: 'อีก 1 ชั่วโมง', question: 'อีก 1 ชั่วโมงมีแนวโน้มฝนไหม?' },
  '3h': { th: 'อีก 3 ชั่วโมง', question: 'อีก 3 ชั่วโมงมีแนวโน้มฝนไหม?' },
};

export function ForecastWeatherCard({ forecast, horizon, loading = false }: ForecastWeatherCardProps) {
  const label = HORIZON_LABEL[horizon];

  if (loading) {
    return (
      <article
        className="weather-card weather-card--forecast weather-card--loading"
        aria-busy="true"
        aria-label={`กำลังโหลดข้อมูลพยากรณ์ ${label.th}`}
      >
        <div className="weather-card__header">
          <span className="eyebrow">MODEL_FORECAST</span>
          <h3>{label.th}</h3>
        </div>
        <div className="weather-card__loading-skeleton" aria-hidden="true" />
      </article>
    );
  }

  if (!forecast) {
    return (
      <article
        className="weather-card weather-card--forecast weather-card--unavailable"
        aria-label={`ข้อมูลพยากรณ์ ${label.th} ไม่พร้อมใช้งาน`}
      >
        <div className="weather-card__header">
          <span className="classification-badge classification-badge--model-forecast">MODEL_FORECAST</span>
          <h3>{label.th}</h3>
        </div>
        <p className="weather-card__unavailable-msg">
          ยังไม่มีข้อมูลพยากรณ์ที่ยืนยันได้
        </p>
        <p className="weather-card__source-note">แหล่งข้อมูล: Open-Meteo · ประเภท: แบบจำลองพยากรณ์</p>
      </article>
    );
  }

  const prob = forecast.precipitationProbabilityPercent;

  return (
    <article
      className="weather-card weather-card--forecast"
      aria-label={`พยากรณ์อากาศ ${label.th} (แบบจำลอง)`}
    >
      <div className="weather-card__header">
        <span className="classification-badge classification-badge--model-forecast">MODEL_FORECAST · แบบจำลองพยากรณ์</span>
        <h3>{label.th}</h3>
        <FreshnessBar freshness={forecast.freshness} compact />
      </div>

      {/* Primary answer */}
      <div className="weather-card__primary-answer" aria-label={label.question}>
        <span className="weather-card__question">{label.question}</span>
        {prob != null ? (
          <span className="weather-card__answer weather-card__answer--data">
            แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน {prob}%
          </span>
        ) : (
          <span className="weather-card__answer weather-card__answer--unavailable">
            ยังไม่มีข้อมูลพยากรณ์ที่ยืนยันได้
          </span>
        )}
      </div>

      <div className="weather-card__metrics">
        <MetricRow label="ปริมาณฝนคาดการณ์" value={forecast.precipitationMm} unit="มม." />
        <MetricRow label="อุณหภูมิคาดการณ์" value={forecast.temperatureCelsius} unit="°C" />
        <MetricRow label="ความชื้นคาดการณ์" value={forecast.humidityPercent} unit="%" />
        <MetricRow label="ความเร็วลมคาดการณ์" value={forecast.windSpeedKph} unit="กม./ชม." />
      </div>

      <footer className="weather-card__footer">
        <dl className="weather-card__meta">
          <div><dt>แหล่งข้อมูล</dt><dd>{forecast.source}</dd></div>
          <div><dt>ประเภท</dt><dd>MODEL_FORECAST · แบบจำลองพยากรณ์</dd></div>
          <div><dt>ใช้ได้ถึง</dt><dd>{formatTimestamp(forecast.validAt)}</dd></div>
          <div><dt>ดึงข้อมูลเมื่อ</dt><dd>{formatTimestamp(forecast.retrievedAt)}</dd></div>
        </dl>
        <p className="weather-card__disclaimer">
          ข้อมูลนี้มาจากแบบจำลองเชิงตัวเลข ไม่ใช่ข้อมูลสังเกตการณ์จริง และไม่ใช่พยากรณ์ทางการ
        </p>
      </footer>
    </article>
  );
}
