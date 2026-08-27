import { describe, expect, it } from 'vitest';
import {
  OFFICIAL_CCTV_STATIONS,
  getCctvStationsByProvince,
  getCctvStationsByRegion,
  getCctvStationsByCategory,
  getCoastalCctvStations,
} from './cctv';

describe('CCTV Watch domain contracts', () => {
  it('contains valid official stations with accurate metadata', () => {
    expect(OFFICIAL_CCTV_STATIONS.length).toBeGreaterThan(5);
    for (const station of OFFICIAL_CCTV_STATIONS) {
      expect(station.id).toMatch(/^cctv-/);
      expect(station.nameTh.length).toBeGreaterThan(3);
      expect(station.latitude).toBeGreaterThan(5);
      expect(station.latitude).toBeLessThan(21);
      expect(station.longitude).toBeGreaterThan(97);
      expect(station.longitude).toBeLessThan(106);
      expect(station.providerNameTh).toBeDefined();
      expect(station.sourceAttribution).toBeDefined();
      expect(station.category).toBeDefined();
    }
  });

  it('filters stations by province, region and category correctly', () => {
    const bkk = getCctvStationsByProvince('กรุงเทพมหานคร');
    expect(bkk.length).toBeGreaterThan(0);
    expect(bkk[0].nameTh).toContain('บางบอน');

    const phuket = getCctvStationsByProvince('ภูเก็ต');
    expect(phuket.length).toBeGreaterThan(0);
    expect(phuket[0].category).toBe('COASTAL_ANDAMAN');

    const central = getCctvStationsByRegion('central');
    expect(central.length).toBeGreaterThanOrEqual(3);

    const coastal = getCoastalCctvStations();
    expect(coastal.length).toBeGreaterThanOrEqual(8);

    const gulf = getCctvStationsByCategory('COASTAL_GULF');
    expect(gulf.length).toBeGreaterThanOrEqual(4);
  });
});
