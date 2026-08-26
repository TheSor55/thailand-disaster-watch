import { describe, expect, it } from 'vitest';
import { calculateRadarFreshness } from './radar';

describe('Radar Domain Model & Helpers (Phase 3.4)', () => {
  it('returns UNAVAILABLE when timestamp is missing or null', () => {
    expect(calculateRadarFreshness(null)).toBe('UNAVAILABLE');
    expect(calculateRadarFreshness(undefined)).toBe('UNAVAILABLE');
    expect(calculateRadarFreshness('')).toBe('UNAVAILABLE');
  });

  it('returns UNKNOWN when timestamp is invalid string or future time', () => {
    expect(calculateRadarFreshness('not-a-date')).toBe('UNKNOWN');
    const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
    expect(calculateRadarFreshness(futureDate)).toBe('UNKNOWN');
  });

  it('returns FRESH for timestamps <= 30 minutes old', () => {
    const freshDate = new Date(Date.now() - 1000 * 60 * 15).toISOString();
    expect(calculateRadarFreshness(freshDate)).toBe('FRESH');
  });

  it('returns DELAYED for timestamps between 31 and 90 minutes old', () => {
    const delayedDate = new Date(Date.now() - 1000 * 60 * 45).toISOString();
    expect(calculateRadarFreshness(delayedDate)).toBe('DELAYED');
  });

  it('returns STALE for timestamps older than 90 minutes', () => {
    const staleDate = new Date(Date.now() - 1000 * 60 * 120).toISOString();
    expect(calculateRadarFreshness(staleDate)).toBe('STALE');
  });
});
