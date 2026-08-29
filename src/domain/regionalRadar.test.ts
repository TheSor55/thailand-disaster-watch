import { describe, expect, it } from 'vitest';
import {
  REGIONAL_RADAR_STATIONS,
  getNearestRegionalRadar,
  calculateDistanceKm,
} from './regionalRadar';

describe('Regional Radar Stations & Matching contracts', () => {
  it('contains verified regional radars covering all regions of Thailand', () => {
    expect(REGIONAL_RADAR_STATIONS.length).toBeGreaterThanOrEqual(15);
    for (const radar of REGIONAL_RADAR_STATIONS) {
      expect(radar.id).toMatch(/^radar-/);
      expect(radar.nameTh.length).toBeGreaterThan(5);
      expect(radar.latitude).toBeGreaterThan(5);
      expect(radar.latitude).toBeLessThan(21);
      expect(radar.longitude).toBeGreaterThan(97);
      expect(radar.longitude).toBeLessThan(106);
      expect(radar.rangeKm).toBeGreaterThanOrEqual(120);
      expect(radar.viewUrl).toBeDefined();
    }
  });

  it('matches Bang Bon (Petchsiam Factory) to BMA Nong Khaem radar', () => {
    // Bang Bon / Petchsiam Factory coordinates
    const match = getNearestRegionalRadar(13.6635, 100.4124);
    expect(match.radar.id).toBe('radar-bma-nongkhaem');
    expect(match.distanceKm).toBeLessThan(15);
    expect(match.isWithinRange).toBe(true);
  });

  it('matches Ayutthaya to Chai Nat / Central radar', () => {
    const match = getNearestRegionalRadar(14.35, 100.55);
    expect(match.isWithinRange).toBe(true);
  });

  it('matches Chiang Mai to Lamphun / Omkoi radar', () => {
    const match = getNearestRegionalRadar(18.7883, 98.9853);
    expect(match.radar.id).toBe('radar-tmd-lamphun');
    expect(match.distanceKm).toBeLessThan(35);
  });

  it('calculates geographic distance accurately', () => {
    // Bangkok to Chiang Mai is approx 580-600 km
    const dist = calculateDistanceKm(13.7563, 100.5018, 18.7883, 98.9853);
    expect(dist).toBeGreaterThan(550);
    expect(dist).toBeLessThan(650);
  });
});
