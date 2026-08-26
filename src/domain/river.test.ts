import { describe, it, expect } from 'vitest';
import { MAJOR_RIVER_STATIONS, getRiverStationsByProvince, getRiverStationsByRegion } from './river';

describe('River Telemetry Model (v1.1)', () => {
  it('contains valid river station definitions with water and bank levels', () => {
    expect(MAJOR_RIVER_STATIONS.length).toBeGreaterThan(5);
    for (const station of MAJOR_RIVER_STATIONS) {
      expect(station.stationCode).toBeTruthy();
      expect(station.riverName).toBeTruthy();
      expect(station.waterLevelMsl).toBeGreaterThan(0);
      expect(station.bankLevelMsl).toBeGreaterThan(0);
      expect(station.dischargeCms).toBeGreaterThanOrEqual(0);
      expect(['RISING', 'STABLE', 'FALLING']).toContain(station.trend);
      expect(station.attribution).toContain('กรมชลประทาน');
    }
  });

  it('filters river stations by province correctly', () => {
    const c2 = getRiverStationsByProvince('นครสวรรค์');
    expect(c2.length).toBeGreaterThanOrEqual(1);
    expect(c2[0].stationCode).toBe('C.2');

    const chiangMai = getRiverStationsByProvince('เชียงใหม่');
    expect(chiangMai.length).toBeGreaterThanOrEqual(1);
    expect(chiangMai[0].stationCode).toBe('P.1');
  });

  it('filters river stations by region correctly', () => {
    const centralStations = getRiverStationsByRegion('central');
    expect(centralStations.length).toBeGreaterThanOrEqual(2);
  });
});
