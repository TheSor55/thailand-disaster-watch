/**
 * FreshnessBar — displays a data freshness state clearly.
 * Uses only the approved freshness vocabulary:
 * FRESH | DELAYED | STALE | UNAVAILABLE | UNKNOWN
 */

type Freshness = 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';

const FRESHNESS_LABEL: Record<Freshness, string> = {
  FRESH: 'ข้อมูลล่าสุด',
  DELAYED: 'ข้อมูลล่าช้า',
  STALE: 'ข้อมูลเก่า',
  UNAVAILABLE: 'ไม่พร้อมใช้งาน',
  UNKNOWN: 'ไม่ทราบความใหม่',
};

const FRESHNESS_CLASS: Record<Freshness, string> = {
  FRESH: 'freshness--fresh',
  DELAYED: 'freshness--delayed',
  STALE: 'freshness--stale',
  UNAVAILABLE: 'freshness--unavailable',
  UNKNOWN: 'freshness--unknown',
};

interface FreshnessBarProps {
  freshness: Freshness;
  compact?: boolean;
}

export function FreshnessBar({ freshness, compact = false }: FreshnessBarProps) {
  return (
    <span
      className={`freshness-bar ${FRESHNESS_CLASS[freshness]}${compact ? ' freshness-bar--compact' : ''}`}
      aria-label={`ความใหม่ของข้อมูล: ${FRESHNESS_LABEL[freshness]}`}
    >
      {FRESHNESS_LABEL[freshness]}
    </span>
  );
}
