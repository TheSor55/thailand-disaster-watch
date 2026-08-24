import { describe, expect, it } from 'vitest';
import { BANGKOK_METRO_PROVINCE_CODES, PROVINCES, PROVINCE_BY_ISO, REGIONS } from './regions';

describe('province and region configuration', () => {
  it('defines exactly 77 unique provinces', () => {
    expect(PROVINCES).toHaveLength(77);
    expect(new Set(PROVINCES.map(({ isoCode }) => isoCode)).size).toBe(77);
    expect(new Set(PROVINCES.map(({ slug }) => slug)).size).toBe(77);
  });

  it('assigns every province to exactly one application region', () => {
    const assigned = REGIONS.flatMap(({ provinceIsoCodes }) => provinceIsoCodes);
    expect(REGIONS).toHaveLength(6);
    expect(assigned).toHaveLength(77);
    expect(new Set(assigned).size).toBe(77);
    expect(new Set(assigned)).toEqual(new Set(PROVINCES.map(({ isoCode }) => isoCode)));
  });

  it('keeps Bangkok Metropolitan quick view limited to valid provinces', () => {
    expect(BANGKOK_METRO_PROVINCE_CODES).toHaveLength(6);
    expect(BANGKOK_METRO_PROVINCE_CODES.every((code) => PROVINCE_BY_ISO.has(code))).toBe(true);
  });
});
