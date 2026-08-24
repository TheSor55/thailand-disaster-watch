import type { SafetyBannerState } from '../domain/safety';

const bannerCopy: Record<SafetyBannerState, string> = {
  NO_LIVE_DATA: 'NO LIVE DATA — DATA SOURCES NOT CONNECTED',
  LIVE_DATA: 'LIVE DATA',
  DELAYED: 'DELAYED DATA',
  STALE: 'STALE DATA — VERIFY BEFORE USE',
  OFFLINE: 'OFFLINE — SHOWING CACHED INFORMATION',
  DEGRADED: 'DEGRADED — SOME DATA SOURCES UNAVAILABLE',
  EXERCISE: 'EXERCISE — NOT A REAL INCIDENT',
  OFFICIAL_WARNING: 'OFFICIAL WARNING',
  SYSTEM_ADVISORY: 'SYSTEM ADVISORY — NOT AN OFFICIAL WARNING',
};

interface SafetyBannerProps {
  state: SafetyBannerState;
  detail?: string;
  compact?: boolean;
}

export function SafetyBanner({ state, detail, compact = false }: SafetyBannerProps) {
  return (
    <div
      className={`safety-banner safety-banner--${state.toLowerCase()}${compact ? ' safety-banner--compact' : ''}`}
      role={state === 'OFFICIAL_WARNING' ? 'alert' : 'status'}
      data-safety-state={state}
    >
      <strong>{bannerCopy[state]}</strong>
      {detail && <span>{detail}</span>}
    </div>
  );
}
