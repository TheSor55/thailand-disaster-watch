/**
 * WeatherSituationPage — Phase 3.2 Usable Weather Preview & Controlled Live Data Mode
 *
 * Provides two explicit preview modes:
 * 1. DEMO PREVIEW: Uses deterministic fixture without network requests.
 * 2. CONTROLLED LIVE PREVIEW: Calls Worker API endpoint (/api/situation/weather).
 *
 * Safety rules preserved:
 * - WEATHER_SITUATION_PIPELINE_ENABLED=false by default in repository
 * - realDataConnected=false
 * - operationalUseApproved=false
 * - No silent fallback to fixture if live preview fails
 * - No direct browser calls to TMD or Open-Meteo
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
import { ModeBadge } from '../../components/weather/ModeBadge';
import { ModeSelector } from '../../components/weather/ModeSelector';
import { LocationSelector } from '../../components/weather/LocationSelector';
import { WeatherExplainer } from '../../components/weather/WeatherExplainer';
import { RadarIntelligenceCard } from '../../components/weather/RadarIntelligenceCard';
import { TimeAlignmentMatrix } from '../../components/weather/TimeAlignmentMatrix';
import { SourceComparisonCard } from '../../components/weather/SourceComparisonCard';
import {
  fetchWeatherSituationUI,
  type WeatherPreviewMode,
  type WeatherSituationLoadState,
  type WeatherSituationRequest,
} from '../../services/weatherSituation';
import { fetchRadarFramesUI, type RadarLoadState } from '../../services/radar';
import {
  buildSituationTimeContext,
  compareWeatherAndRadarSources,
} from '../../domain/intelligence';
import type { WeatherSituation } from '../../domain/weather';
import { WindyView } from '../../components/windy/WindyView';

const GATE_FLAGS = [
  { key: 'WEATHER_SITUATION_PIPELINE_ENABLED', label: 'Weather Pipeline', value: 'false' },
  { key: 'RADAR_PREVIEW_ENABLED', label: 'Radar Preview', value: 'false' },
  { key: 'RAINVIEWER_PILOT_ENABLED', label: 'RainViewer Pilot', value: 'false' },
  { key: 'OPEN_METEO_PILOT_ENABLED', label: 'Open-Meteo Pilot', value: 'false' },
  { key: 'TMD_PILOT_ENABLED', label: 'TMD Pilot', value: 'false' },
  { key: 'GISTDA_PILOT_ENABLED', label: 'GISTDA Pilot', value: 'false' },
  { key: 'realDataConnected', label: 'Real Data Connected', value: false },
  { key: 'operationalUseApproved', label: 'Operational Use Approved', value: false },
];

function getInitialRequest(): WeatherSituationRequest {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const latParam = urlParams.get('lat');
    const lonParam = urlParams.get('lon');
    const modeParam = urlParams.get('mode');

    const lat = latParam ? parseFloat(latParam) : 13.7563;
    const lon = lonParam ? parseFloat(lonParam) : 100.5018;
    const mode: WeatherPreviewMode = modeParam === 'live' ? 'LIVE' : 'DEMO';

    return {
      latitude: isNaN(lat) ? 13.7563 : lat,
      longitude: isNaN(lon) ? 100.5018 : lon,
      label: 'กรุงเทพมหานคร (Bangkok)',
      mode,
    };
  }

  return {
    latitude: 13.7563,
    longitude: 100.5018,
    label: 'กรุงเทพมหานคร (Bangkok)',
    mode: 'DEMO',
  };
}

function updateUrlParams(req: WeatherSituationRequest) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('lat', req.latitude.toFixed(4));
  url.searchParams.set('lon', req.longitude.toFixed(4));
  url.searchParams.set('mode', req.mode.toLowerCase());
  window.history.replaceState({}, '', url.toString());
}

function formatGenerated(ts: string): string {
  try {
    return new Date(ts).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'medium' });
  } catch {
    return ts;
  }
}

function getSituationData(state: WeatherSituationLoadState): WeatherSituation | null {
  if (state.status === 'AVAILABLE' || state.status === 'PARTIAL' || state.status === 'DEMO') {
    return state.data;
  }
  return null;
}

interface WeatherSituationPageProps {
  onBack?: () => void;
}

export function WeatherSituationPage({ onBack }: WeatherSituationPageProps = {}) {
  const [request, setRequest] = useState<WeatherSituationRequest>(getInitialRequest);
  const [loadState, setLoadState] = useState<WeatherSituationLoadState>({ status: 'IDLE' });
  const [radarState, setRadarState] = useState<RadarLoadState>({ status: 'IDLE' });
  const [showGates, setShowGates] = useState(false);
  const [showClassification, setShowClassification] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const executeLoad = useCallback(
    (req: WeatherSituationRequest, ctrl: AbortController) => {
      // Concurrent fetch with failure isolation
      fetchWeatherSituationUI(req, ctrl.signal)
        .then((res) => setLoadState(res))
        .catch(() => {
          /* abort is expected on unmount or new request */
        });

      fetchRadarFramesUI(req.mode, ctrl.signal)
        .then((res) => setRadarState(res))
        .catch(() => {
          /* abort is expected */
        });
    },
    [],
  );

  const handleModeChange = useCallback(
    (nextMode: WeatherPreviewMode) => {
      setRequest((prev) => {
        const nextReq = { ...prev, mode: nextMode };
        updateUrlParams(nextReq);
        return nextReq;
      });
    },
    [],
  );

  const handleLocationChange = useCallback(
    (nextLoc: { latitude: number; longitude: number; label?: string | null }) => {
      setRequest((prev) => {
        const nextReq: WeatherSituationRequest = {
          ...prev,
          latitude: nextLoc.latitude,
          longitude: nextLoc.longitude,
          label: nextLoc.label,
        };
        updateUrlParams(nextReq);
        return nextReq;
      });
    },
    [],
  );

  const handleRefresh = useCallback(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoadState({ status: 'LOADING' });
    setRadarState({ status: 'LOADING' });
    executeLoad(request, ctrl);
  }, [request, executeLoad]);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    executeLoad(request, ctrl);
    return () => {
      ctrl.abort();
    };
  }, [request, executeLoad]);

  const situation = getSituationData(loadState);
  const isDemo = request.mode === 'DEMO';
  const isLive = request.mode === 'LIVE';
  const isLoading = loadState.status === 'LOADING' || loadState.status === 'IDLE';
  const isLiveUnavailable = loadState.status === 'LIVE_UNAVAILABLE';
  const isError = loadState.status === 'ERROR';

  const radarFrames =
    radarState.status === 'AVAILABLE' || radarState.status === 'DEMO'
      ? radarState.data.frames
      : [];
  const latestRadarFrame = radarFrames.length > 0 ? radarFrames[radarFrames.length - 1] : null;

  const timeContext = buildSituationTimeContext(
    situation?.generatedAt || new Date().toISOString(),
    situation?.observed?.observedAt,
    latestRadarFrame?.frameTime,
    situation?.forecast?.validAt,
    null,
  );

  const comparison = compareWeatherAndRadarSources({
    hasObservedData: Boolean(situation?.observed),
    isObservedRaining:
      situation?.observed?.precipitation != null ? situation.observed.precipitation > 0 : null,
    hasForecastData: Boolean(situation?.forecast),
    forecast1hProb: situation?.forecast?.precipitationProbabilityPercent ?? null,
    forecast1hPrecipMm: situation?.forecast?.precipitationMm ?? null,
    hasRadarData: radarState.status === 'AVAILABLE' || radarState.status === 'DEMO',
  });

  const tmdStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN' = situation?.observed
    ? 'AVAILABLE'
    : loadState.status === 'AVAILABLE' || loadState.status === 'DEMO'
      ? 'UNAVAILABLE'
      : 'UNKNOWN';

  const radarProviderStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN' =
    radarState.status === 'AVAILABLE' || radarState.status === 'DEMO'
      ? 'AVAILABLE'
      : radarState.status === 'RADAR_UNAVAILABLE' || radarState.status === 'ERROR'
        ? 'UNAVAILABLE'
        : 'UNKNOWN';

  const forecastProviderStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN' = situation?.forecast
    ? 'AVAILABLE'
    : loadState.status === 'AVAILABLE' || loadState.status === 'DEMO'
      ? 'UNAVAILABLE'
      : 'UNKNOWN';

  return (
    <div className="weather-situation-page" aria-label="Weather Situation">
      {/* Back button to GIS Map when navigation handler provided */}
      {onBack && (
        <div className="weather-nav-bar">
          <button
            type="button"
            className="weather-back-btn"
            onClick={onBack}
            aria-label="กลับไปหน้าแผนที่ GIS"
          >
            ← กลับไปหน้าแผนที่ GIS
          </button>
        </div>
      )}

      {/* Prominent Development Preview Banner — always visible */}
      <PreviewBadge />

      {/* Explicit Data Mode Indicator Badge */}
      <ModeBadge mode={request.mode} />

      {/* Lightweight Explainer / Semantics Guide */}
      <WeatherExplainer />

      {/* Mode Selector (DEMO vs CONTROLLED LIVE) */}
      <ModeSelector
        mode={request.mode}
        onModeChange={handleModeChange}
        disabled={isLoading}
      />

      {/* Controlled Location Selector */}
      <LocationSelector
        location={request}
        onLocationChange={handleLocationChange}
        disabled={isLoading}
      />

      {/* Page Header with Location, Timestamp & Refresh */}
      <header className="weather-page-header">
        <div>
          <span className="eyebrow">WEATHER SITUATION · {isDemo ? 'DEMO PREVIEW' : 'CONTROLLED LIVE PREVIEW'}</span>
          <h2>{request.label ?? `พิกัด ${request.latitude.toFixed(4)}, ${request.longitude.toFixed(4)}`}</h2>
          <p className="weather-page-location">
            📍 {request.latitude.toFixed(4)}, {request.longitude.toFixed(4)}
            {isDemo && <span className="weather-page-location__demo"> (โหมดข้อมูลตัวอย่าง DEMO)</span>}
            {isLive && <span className="weather-page-location__live"> (โหมดทดสอบสด CONTROLLED LIVE)</span>}
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
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label="รีเฟรชข้อมูลสภาพอากาศ"
        >
          {isLoading ? '⟳ กำลังโหลด…' : '⟳ รีเฟรชข้อมูล'}
        </button>
      </header>

      {/* LIVE PREVIEW UNAVAILABLE State — No Silent Fallback! */}
      {isLiveUnavailable && (
        <div className="weather-live-unavailable" role="alert">
          <div className="weather-live-unavailable__header">
            <strong>⚠ LIVE PREVIEW UNAVAILABLE (ข้อมูลสดไม่พร้อมใช้งาน)</strong>
          </div>
          <p className="weather-live-unavailable__msg">
            {'message' in loadState ? loadState.message : 'ไม่สามารถรับข้อมูลจาก Worker API ได้'}
          </p>
          <div className="weather-live-unavailable__actions">
            <button
              type="button"
              className="weather-switch-demo-btn"
              onClick={() => handleModeChange('DEMO')}
            >
              ➔ สลับเป็น DEMO PREVIEW (ดูข้อมูลตัวอย่าง)
            </button>
            <button
              type="button"
              className="weather-retry-btn"
              onClick={handleRefresh}
            >
              ⟳ ลองดึงข้อมูลสดอีกครั้ง
            </button>
          </div>
        </div>
      )}

      {/* General Error State */}
      {isError && (
        <div className="weather-error-state" role="alert">
          <strong>ไม่สามารถรับข้อมูลสภาพอากาศจากแหล่งที่ตรวจสอบได้ในขณะนี้</strong>
          <span>{'message' in loadState ? loadState.message : ''}</span>
          <button type="button" onClick={handleRefresh}>ลองใหม่</button>
        </div>
      )}

      {/* Main Weather & Radar Intelligence Cards Grid */}
      <div className="weather-cards-grid">
        {/* Section A: Observed Weather (TMD) — Strict Observed Data Only */}
        <ObservedWeatherCard
          observed={situation?.observed ?? null}
          loading={isLoading}
        />

        {/* Section B: Radar Intelligence Card (RainViewer) — Remote-Sensed Observation */}
        <RadarIntelligenceCard
          radarState={radarState}
          onNavigateToMap={onBack}
        />

        {/* Section C: +1 Hour Forecast (Open-Meteo) — Probabilistic Model Forecast */}
        <ForecastWeatherCard
          forecast={situation?.forecast ?? null}
          horizon="1h"
          loading={isLoading}
        />

        {/* Section D: +3 Hours Forecast (Open-Meteo) — Probabilistic Model Forecast */}
        <ForecastWeatherCard
          forecast={situation?.forecast ?? null}
          horizon="3h"
          loading={isLoading}
        />
      </div>

      {/* Section E: Windy.com Interactive Meteorology (Wind, Rain, Clouds, Storm) */}
      <div className="weather-windy-section" style={{ margin: '16px 0' }}>
        <WindyView
          lat={request.latitude}
          lon={request.longitude}
          zoom={8}
          locationName={request.label ?? 'ประเทศไทย'}
        />
      </div>

      {/* Section E: Time Alignment Matrix */}
      <TimeAlignmentMatrix timeContext={timeContext} />

      {/* Section F: Source Status & Semantic Comparison */}
      <SourceComparisonCard
        comparison={comparison}
        tmdStatus={tmdStatus}
        radarStatus={radarProviderStatus}
        forecastStatus={forecastProviderStatus}
      />

      {/* Secondary Panels (Provenance & Agreement) */}
      {situation && (
        <div className="weather-secondary-panels">
          {/* Source Provenance Panel */}
          <SourcePanel
            observed={situation.observed}
            forecast={situation.forecast}
          />

          {/* Source Agreement & Limitations Panel */}
          <AgreementPanel
            agreement={situation.sourceAgreement}
            limitations={situation.limitations}
          />
        </div>
      )}

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

      {/* Collapsible: System Gate Status (Developer Info) */}
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

      {/* Footer — Safety Reminder */}
      <footer className="weather-page-footer">
        <p>
          ⚠ ข้อมูลนี้เป็น <strong>DEVELOPMENT PREVIEW ({isDemo ? 'DEMO' : 'CONTROLLED LIVE'})</strong> เท่านั้น — ไม่ใช่ระบบเตือนภัยทางการ
          การแจ้งเตือนภัยทางการโปรดติดตามจากกรมอุตุนิยมวิทยา (TMD) และหน่วยงานที่มีอำนาจ
        </p>
      </footer>
    </div>
  );
}
