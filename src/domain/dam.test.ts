import { describe, it, expect } from 'vitest';
import { MAJOR_DAMS, getDamsByProvince, getDamsByRegion } from './dam';

describe('Dam Telemetry Model (v1.1)', () => {
  it('contains valid dam definitions with capacity and metadata', () => {
    expect(MAJOR_DAMS.length).toBeGreaterThan(5);
    for (const dam of MAJOR_DAMS) {
      expect(dam.damId).toBeTruthy();
      expect(dam.nameTh).toBeTruthy();
      expect(dam.capacityMcm).toBeGreaterThan(0);
      expect(dam.currentStorageMcm).toBeGreaterThan(0);
      expect(dam.storagePercent).toBeGreaterThanOrEqual(0);
      expect(dam.storagePercent).toBeLessThanOrEqual(100);
      expect(dam.attribution).toBeTruthy();
    }
  });

  it('filters dams by province correctly', () => {
    const chonburiDams = getDamsByProvince('ชลบุรี');
    expect(chonburiDams.length).toBeGreaterThanOrEqual(1);
    expect(chonburiDams[0].nameTh).toContain('บางพระ');

    const khonKaenDams = getDamsByProvince('ขอนแก่น');
    expect(khonKaenDams.length).toBeGreaterThanOrEqual(1);
    expect(khonKaenDams[0].nameTh).toContain('อุบลรัตน์');
  });

  it('filters dams by region correctly', () => {
    const northDams = getDamsByRegion('north');
    expect(northDams.length).toBeGreaterThanOrEqual(2);
    expect(northDams.map((d) => d.nameTh)).toContain('เขื่อนภูมิพล');
    expect(northDams.map((d) => d.nameTh)).toContain('เขื่อนสิริกิติ์');
  });
});
