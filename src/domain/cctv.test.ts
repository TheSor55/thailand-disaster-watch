import { describe, expect, it } from 'vitest';
import {
  OFFICIAL_CCTV_STATIONS,
  getCctvStationsByProvince,
  getCctvStationsByRegion,
} from './cctv';

describe('CCTV Watch domain contracts', () => {
  it('contains valid official stations with accurate metadata', () => {
    expect(OFFICIAL_CCTV_STATIONS.length).toBeGreaterThan(0);
    for (const station of OFFICIAL_CCTV_STATIONS) {
      expect(station.id).toMatch(/^cctv-/);
      expect(station.nameTh.length).toBeGreaterThan(3);
      expect(station.latitude).toBeGreaterThan(5);
      expect(station.latitude).toBeLessThan(21);
      expect(station.longitude).toBeGreaterThan(97);
      expect(station.longitude).toBeLessThan(106);
      expect(station.providerNameTh).toBeDefined();
      expect(station.sourceAttribution).toBeDefined();
    }
  });

  it('filters stations by province and region correctly', () => {
    const bkk = getCctvStationsByProvince('กรุงเทพมหานคร');
    expect(bkk.length).toBeGreaterThan(0);
    expect(bkk[0].nameTh).toContain('บางบอน');

    const central = getCctvStationsByRegion('central');
    expect(central.length).toBeGreaterThanOrEqual(3);

    const chiangmai = getCctvStationsByProvince('เชียงใหม่');
    expect(chiangmai.length).toBeGreaterThan(0);
    expect(chiangmai[0].waterwayTh).toBe('แม่น้ำปิง');
  });
});
