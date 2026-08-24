import { describe, expect, it } from 'vitest';
import { safetyLabel } from './safety';

describe('safety semantics', () => {
  it('never presents a system advisory as an official warning', () => {
    expect(safetyLabel('SYSTEM_ADVISORY')).not.toBe(safetyLabel('OFFICIAL_WARNING'));
    expect(safetyLabel('SYSTEM_ADVISORY')).toContain('NOT AN OFFICIAL WARNING');
  });

  it('separates BCM recommendation from human-authorized activation', () => {
    expect(safetyLabel('SYSTEM_ADVISORY')).not.toBe(safetyLabel('BCM_ACTIVATION'));
    expect(safetyLabel('BCM_RECOMMENDATION')).not.toBe(safetyLabel('BCM_ACTIVATION'));
    expect(safetyLabel('BCM_RECOMMENDATION')).toContain('HUMAN DECISION REQUIRED');
  });

  it('labels exercises as non-real incidents', () => {
    expect(safetyLabel('EXERCISE')).toContain('NOT A REAL INCIDENT');
  });
});
