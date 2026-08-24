import { describe, expect, it } from 'vitest';

import { compareSourceAuthority, evaluateFreshness } from './governance';

const policy = { delayedAfterMs: 60_000, staleAfterMs: 120_000 };
const now = '2026-08-24T12:00:00.000Z';

describe('evaluateFreshness', () => {
  it.each([
    ['2026-08-24T11:59:30.000Z', 'FRESH'],
    ['2026-08-24T11:59:00.000Z', 'DELAYED'],
    ['2026-08-24T11:58:00.000Z', 'STALE'],
  ] as const)('classifies %s as %s from an injected source policy', (observedAt, expected) => {
    expect(evaluateFreshness({ observedAt, now, sourceAvailable: true }, policy)).toBe(expected);
  });

  it('keeps missing, invalid, and future observation times unknown', () => {
    expect(evaluateFreshness({ observedAt: null, now, sourceAvailable: true }, policy)).toBe('UNKNOWN');
    expect(evaluateFreshness({ observedAt: 'invalid', now, sourceAvailable: true }, policy)).toBe('UNKNOWN');
    expect(evaluateFreshness({ observedAt: '2026-08-24T12:01:00Z', now, sourceAvailable: true }, policy)).toBe('UNKNOWN');
  });

  it('fails closed for invalid policy and unavailable sources', () => {
    expect(evaluateFreshness({ observedAt: now, now, sourceAvailable: true }, { delayedAfterMs: 10, staleAfterMs: 5 })).toBe('UNKNOWN');
    expect(evaluateFreshness({ observedAt: now, now, sourceAvailable: false }, policy)).toBe('UNAVAILABLE');
  });
});

describe('source authority', () => {
  it('never allows AI summary to outrank official information', () => {
    expect(compareSourceAuthority('OFFICIAL_WARNING', 'AI_SUMMARY')).toBeGreaterThan(0);
    expect(compareSourceAuthority('OFFICIAL_OBSERVATION', 'AI_SUMMARY')).toBeGreaterThan(0);
  });
});
