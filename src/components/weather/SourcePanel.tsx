/**
 * SourcePanel — displays source provenance for each weather data source.
 * Each entry shows: Source, Classification, Timestamp, Freshness.
 * Never shows "AI Data" or omits classification.
 */

import { FreshnessBar } from './FreshnessBar';
import type { WeatherSituationObserved, WeatherSituationForecast } from '../../domain/weather';

interface SourcePanelProps {
  observed: WeatherSituationObserved | null;
  forecast: WeatherSituationForecast | null;
}

function formatTimestamp(ts: string | null | undefined): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('th-TH', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return ts;
  }
}

export function SourcePanel({ observed, forecast }: SourcePanelProps) {
  return (
    <section className="source-panel" aria-label="Data Sources">
      <div className="source-panel__header">
        <span className="eyebrow">DATA SOURCES</span>
        <h3>แหล่งข้อมูล</h3>
      </div>

      <div className="source-panel__entries">
        {/* Observed source */}
        <div className="source-entry" data-classification="observed">
          <div className="source-entry__header">
            <strong className="source-entry__name">{observed?.source ?? 'TMD'}</strong>
            <span className="classification-badge classification-badge--observed">OBSERVED</span>
          </div>
          {observed ? (
            <dl className="source-entry__meta">
              <div>
                <dt>สังเกตการณ์เมื่อ</dt>
                <dd>{formatTimestamp(observed.observedAt)}</dd>
              </div>
              <div>
                <dt>ดึงข้อมูลเมื่อ</dt>
                <dd>{formatTimestamp(observed.retrievedAt)}</dd>
              </div>
              <div>
                <dt>ความใหม่</dt>
                <dd><FreshnessBar freshness={observed.freshness} compact /></dd>
              </div>
              <div>
                <dt>แหล่งที่มา</dt>
                <dd className="source-entry__provenance">{observed.provenance}</dd>
              </div>
            </dl>
          ) : (
            <p className="source-entry__unavailable">ไม่พร้อมใช้งาน</p>
          )}
        </div>

        {/* Forecast source */}
        <div className="source-entry" data-classification="model-forecast">
          <div className="source-entry__header">
            <strong className="source-entry__name">{forecast?.source ?? 'Open-Meteo'}</strong>
            <span className="classification-badge classification-badge--model-forecast">MODEL_FORECAST</span>
          </div>
          {forecast ? (
            <dl className="source-entry__meta">
              <div>
                <dt>ใช้ได้ถึง</dt>
                <dd>{formatTimestamp(forecast.validAt)}</dd>
              </div>
              <div>
                <dt>ดึงข้อมูลเมื่อ</dt>
                <dd>{formatTimestamp(forecast.retrievedAt)}</dd>
              </div>
              <div>
                <dt>ความใหม่</dt>
                <dd><FreshnessBar freshness={forecast.freshness} compact /></dd>
              </div>
              <div>
                <dt>แหล่งที่มา</dt>
                <dd className="source-entry__provenance">{forecast.provenance}</dd>
              </div>
            </dl>
          ) : (
            <p className="source-entry__unavailable">ไม่พร้อมใช้งาน</p>
          )}
        </div>
      </div>
    </section>
  );
}
