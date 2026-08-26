/**
 * WeatherSituationPage — Phase 3.1 Safe Preview
 *
 * Displays observed weather and model forecast separately,
 * with clear source provenance, freshness, and safety labelling.
 *
 * Safety rules preserved:
 * - WEATHER_SITUATION_PIPELINE_ENABLED=false by default
 * - realDataConnected=false
 * - operationalUseApproved=false
 *
 * In PIPELINE_DISABLED state, shows fixture with DEMO/PREVIEW label.
 * No official warning or BCM actions are generated from forecast data.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ObservedWeatherCard } from '../../components/weather/ObservedWeatherCard';
import { ForecastWeatherCard } from '../../components/weather/ForecastWeatherCard';
import { SourcePanel } from '../../components/weather/SourcePanel';
import { AgreementPanel } from '../../components/weather/AgreementPanel';
import { ClassificationGuide } from '../../components/weather/ClassificationGuide';
import { SystemGatePanel } from '../../components/weather/SystemGatePanel';
import { PreviewBadge } from '../../components/weather/PreviewBadge';
import { FreshnessBar } from '../../components/weather/FreshnessBar';
import {
  fetchWeatherSituationUI,
  type WeatherSituationLoadState,
  type WeatherSituationRequest,
} from '../../services/weatherSituation';
import type { WeatherSituation } from '../../domain/weather';

// Bangkok as the default development location
const DEFAULT_LOCATION: WeatherSituationRequest = {
  latitude: 13.7563,
  longitude: 100.5018,
  label: 'กรุงเทพมหานคร (ตัวอย่างพัฒนา)',
};

const GATE_FLAGS = [
  { key: 'WEATHER_SITUATION_PIPELINE_ENABLED', label: 'Weather Pipeline', value: 'false' },
  { key: 'OPEN_METEO_PILOT_ENABLED', label: 'Open-Meteo Pilot', value: 'false' },
  { key: 'TMD_PILOT_ENABLED', label: 'TMD Pilot', value: 'false' },
  { key: 'GISTDA_PILOT_ENABLED', label: 'GISTDA Pilot', value: 'false' },
  { key: 'realDataConnected', label: 'Real Data Connected', value: false },
  { key: 'operationalUseApproved', label: 'Operational Use Approved', value: false },
];

function formatGenerated(ts: string): string {
  try {
    return new Date(ts).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'medium' });
  } catch {
    return ts;
  }
}

function getSituationData(state: WeatherSituationLoadState): WeatherSituation | null {
  if (state.status === 'AVAILABLE' || state.status === 'PARTIAL') return state.data;
  if (state.status === 'PIPELINE_DISABLED') return state.fixture;
  return null;
}

export function WeatherSituationPage() {
  const [loadState, setLoadState] = useState<WeatherSituationLoadState>({ status: 'IDLE' });
  const [location] = useState<WeatherSituationRequest>(DEFAULT_LOCATION);
  const [showGates, setShowGates] = useState(false);
  const [showClassification, setShowClassification] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runLoad = useCallback((loc: WeatherSituationRequest, onResult: (r: WeatherSituationLoadState) => void) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    onResult({ status: 'LOADING' });
    fetchWeatherSituationUI(loc, ctrl.signal)
      .then(onResult)
      .catch(() => { /* abort is expected on unmount */ });
  }, []);

  const loadSituation = useCallback(() => {
    runLoad(location, setLoadState);
  }, [location, runLoad]);

  useEffect(() => {
    runLoad(location, setLoadState);
    return () => { abortRef.current?.abort(); };
  }, [location, runLoad]);

  const situation = getSituationData(loadState);
  const isPipelineDisabled = loadState.status === 'PIPELINE_DISABLED';
  const isLoading = loadState.status === 'LOADING' || loadState.status === 'IDLE';
  const isError = loadState.status === 'ERROR';

  return (
    <div className="weather-situation-page" aria-label="Weather Situation">

      {/* Prominent Development Preview Banner — always visible */}
      <PreviewBadge />

      {isPipelineDisabled && (
        <div className="pipeline-disabled-notice" role="status">
          <strong>DEMO / PREVIEW</strong>
          <span>
            Pipeline ปิดอยู่ (WEATHER_SITUATION_PIPELINE_ENABLED=false) — แสดงข้อมูลตัวอย่างเท่านั้น
            ไม่ใช่ข้อมูลจริง
          </span>
        </div>
      )}

      {/* Page header */}
      <header className="weather-page-header">
        <div>
          <span className="eyebrow">WEATHER SITUATION</span>
          <h2>สภาพอากาศ</h2>
          <p className="weather-page-location">
            📍 {location.label ?? `${location.latitude}, ${location.longitude}`}
            {isPipelineDisabled && (
              <span className="weather-page-location__demo"> (ตัวอย่างพัฒนา)</span>
            )}
          </p>
        </div>
        {situation && (
          <div className="weather-page-header__meta">
            <span className="eyebrow">ข้อมูลถูกสร้างเมื่อ</span>
            <time className="weather-page-header__generated">
              {formatGenerated(situation.generatedAt)}
            </time>
            <FreshnessBar freshness={situation.observed?.freshness ?? 'UNKNOWN'} compact />
          </div>
        )}
        <button
          type="button"
          className="weather-refresh-btn"
          onClick={() => { void loadSituation(); }}
          disabled={isLoading}
          aria-label="รีเฟรชข้อมูลสภาพอากาศ"
        >
          {isLoading ? '⟳ กำลังโหลด…' : '⟳ รีเฟรช'}
        </button>
      </header>

      {/* Error state */}
      {isError && (
        <div className="weather-error-state" role="alert">
          <strong>ไม่สามารถรับข้อมูลสภาพอากาศจากแหล่งที่ตรวจสอบได้ในขณะนี้</strong>
          <span>{'message' in loadState ? loadState.message : ''}</span>
          <button type="button" onClick={() => { void loadSituation(); }}>ลองใหม่</button>
        </div>
      )}

      {/* Main weather cards grid */}
      <div className="weather-cards-grid">
        {/* Card A: Observed */}
        <ObservedWeatherCard
          observed={situation?.observed ?? null}
          loading={isLoading}
        />

        {/* Card B: 1h forecast */}
        <ForecastWeatherCard
          forecast={situation?.forecast ?? null}
          horizon="1h"
          loading={isLoading}
        />

        {/* Card C: 3h forecast — uses same forecast slot, clearly labelled */}
        <ForecastWeatherCard
          forecast={situation?.forecast ?? null}
          horizon="3h"
          loading={isLoading}
        />
      </div>

      {/* Secondary panels */}
      <div className="weather-secondary-panels">
        {/* Source provenance panel */}
        {situation && (
          <SourcePanel
            observed={situation.observed}
            forecast={situation.forecast}
          />
        )}

        {/* Agreement panel */}
        {situation && (
          <AgreementPanel
            agreement={situation.sourceAgreement}
            limitations={situation.limitations}
          />
        )}
      </div>

      {/* Collapsible: Data Classification Guide */}
      <div className="weather-accordion">
        <button
          type="button"
          className="weather-accordion__trigger"
          aria-expanded={showClassification}
          onClick={() => setShowClassification((v) => !v)}
          aria-controls="classification-guide-panel"
        >
          ประเภทข้อมูล (Data Classification Guide)
          <span aria-hidden="true">{showClassification ? '▲' : '▼'}</span>
        </button>
        <div id="classification-guide-panel" hidden={!showClassification}>
          <ClassificationGuide />
        </div>
      </div>

      {/* Collapsible: System Gate Status (developer info) */}
      <div className="weather-accordion">
        <button
          type="button"
          className="weather-accordion__trigger"
          aria-expanded={showGates}
          onClick={() => setShowGates((v) => !v)}
          aria-controls="system-gate-panel"
        >
          System Gate Status (Developer Info)
          <span aria-hidden="true">{showGates ? '▲' : '▼'}</span>
        </button>
        <div id="system-gate-panel" hidden={!showGates}>
          <SystemGatePanel flags={GATE_FLAGS} />
        </div>
      </div>

      {/* Footer — safety reminder */}
      <footer className="weather-page-footer">
        <p>
          ⚠ ข้อมูลนี้เป็น <strong>DEVELOPMENT PREVIEW</strong> เท่านั้น — ไม่ใช่ระบบเตือนภัยทางการ
          การแจ้งเตือนภัยทางการโปรดติดตามจากกรมอุตุนิยมวิทยา (TMD) และหน่วยงานที่มีอำนาจ
        </p>
      </footer>
    </div>
  );
}
