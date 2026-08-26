/**
 * ModeBadge — Displays prominent textual indicator of the active data mode.
 * Does not rely on color alone.
 */

import type { WeatherPreviewMode } from '../../services/weatherSituation';

interface ModeBadgeProps {
  mode: WeatherPreviewMode;
  compact?: boolean;
}

export function ModeBadge({ mode, compact = false }: ModeBadgeProps) {
  if (mode === 'DEMO') {
    return (
      <div
        className={`mode-badge mode-badge--demo${compact ? ' mode-badge--compact' : ''}`}
        role="status"
        aria-label="Active Data Mode: DEMO PREVIEW"
      >
        <span className="mode-badge__tag">DATA MODE: DEMO PREVIEW</span>
        {!compact && (
          <span className="mode-badge__sub">
            DEMO DATA · DEVELOPMENT PREVIEW · NOT OPERATIONAL
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`mode-badge mode-badge--live${compact ? ' mode-badge--compact' : ''}`}
      role="status"
      aria-label="Active Data Mode: CONTROLLED LIVE PREVIEW"
    >
      <span className="mode-badge__tag">DATA MODE: CONTROLLED LIVE PREVIEW</span>
      {!compact && (
        <span className="mode-badge__sub">
          CONTROLLED LIVE PREVIEW · NOT OPERATIONAL · NOT AN OFFICIAL WARNING
        </span>
      )}
    </div>
  );
}
