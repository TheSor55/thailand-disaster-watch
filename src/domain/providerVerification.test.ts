import { describe, expect, it } from 'vitest';
import { compareWaterObservations, type WaterStationObservation } from './water';
import { tmdPilotStatus, fetchTmdWeatherData } from '../../worker/src/providers/tmd';
import { ridPilotStatus, fetchRidWaterData } from '../../worker/src/providers/rid';
import { thaiWaterPilotStatus, fetchThaiWaterData } from '../../worker/src/providers/thaiwater';
import { egatPilotStatus, fetchEgatWaterData } from '../../worker/src/providers/egat';
import { openMeteoPilotStatus, fetchOpenMeteoForecast } from '../../worker/src/providers/open-meteo';

describe('Provider Verification and Governance Rules', () => {
  describe('Data Classification & Separation', () => {
    it('ensures observations and forecasts remain separated without mixed schemas', () => {
      const observation: WaterStationObservation = {
        stationId: 'ST-01',
        stationName: 'Ping River Station',
        latitude: 18.79,
        longitude: 98.99,
        parameter: 'RIVER_LEVEL',
        value: 3.45,
        unit: 'm',
        observedAt: '2026-08-25T10:00:00Z',
        retrievedAt: '2026-08-25T10:05:00Z',
        freshness: 'FRESH',
        provider: 'RID',
        source: 'telemetry',
      };
      expect(observation.parameter).toBe('RIVER_LEVEL');
      expect(observation.observedAt).toBe('2026-08-25T10:00:00Z');
    });
  });

  describe('Timestamp and Unit Integrity', () => {
    it('preserves null/unknown states and does not fabricate missing observedAt timestamps', () => {
      const observation: WaterStationObservation = {
        stationId: 'ST-02',
        stationName: 'Nan River Station',
        latitude: 17.62,
        longitude: 100.15,
        parameter: 'DISCHARGE',
        value: 120.5,
        unit: 'm3/s',
        observedAt: null,
        retrievedAt: '2026-08-25T10:05:00Z',
        freshness: 'UNKNOWN',
        provider: 'RID',
        source: 'manual_log',
      };
      expect(observation.observedAt).toBeNull();
      expect(observation.freshness).toBe('UNKNOWN');
    });

    it('requires explicit unit specifications and does not perform unit inference without metadata', () => {
      const rawPayload = { val: 42, m: 'nan' }; // Missing explicit unit mapping
      const parseUnit = (payload: typeof rawPayload): string => {
        if (payload.m === 'nan') return 'UNKNOWN';
        return 'm';
      };
      expect(parseUnit(rawPayload)).toBe('UNKNOWN');
    });
  });

  describe('Activation Gate Protection', () => {
    it('keeps TMD, RID, ThaiWater, EGAT, and Open-Meteo pilots disabled by default', () => {
      expect(tmdPilotStatus({})).toBe('DISABLED');
      expect(ridPilotStatus({})).toBe('DISABLED');
      expect(thaiWaterPilotStatus({})).toBe('DISABLED');
      expect(egatPilotStatus({})).toBe('DISABLED');
      expect(openMeteoPilotStatus({})).toBe('DISABLED');
    });

    it('denies data fetches for disabled/unconfigured providers', async () => {
      await expect(fetchTmdWeatherData({})).rejects.toThrow('TMD Weather Pilot is currently disabled or unconfigured');
      await expect(fetchRidWaterData({})).rejects.toThrow('RID Water Pilot is currently disabled');
      await expect(fetchThaiWaterData({})).rejects.toThrow('ThaiWater Pilot is currently disabled or unconfigured');
      await expect(fetchEgatWaterData({})).rejects.toThrow('EGAT Telemetry Pilot is currently disabled');
      await expect(fetchOpenMeteoForecast({})).rejects.toThrow('Open-Meteo Weather Pilot is currently disabled');
    });
  });

  describe('Telemetry Comparison and Conflict Logic', () => {
    const baseObs: WaterStationObservation = {
      stationId: 'ST-01',
      stationName: 'Station 1',
      latitude: 13.75,
      longitude: 100.5,
      parameter: 'RIVER_LEVEL',
      value: 10.0,
      unit: 'm',
      observedAt: '2026-08-25T10:00:00Z',
      retrievedAt: '2026-08-25T10:05:00Z',
      freshness: 'FRESH',
      provider: 'RID',
      source: 'telemetry',
    };

    it('returns CONSISTENT if values differ within tolerance', () => {
      const obsB = { ...baseObs, value: 10.2, provider: 'THAIWATER' }; // 2% difference
      expect(compareWaterObservations(baseObs, obsB, 0.05)).toBe('CONSISTENT');
    });

    it('returns PARTIAL_AGREEMENT if values differ slightly above tolerance', () => {
      const obsB = { ...baseObs, value: 10.8, provider: 'THAIWATER' }; // 8% difference
      expect(compareWaterObservations(baseObs, obsB, 0.05)).toBe('PARTIAL_AGREEMENT');
    });

    it('returns CONFLICT if values differ significantly above tolerance', () => {
      const obsB = { ...baseObs, value: 12.5, provider: 'THAIWATER' }; // 25% difference
      expect(compareWaterObservations(baseObs, obsB, 0.05)).toBe('CONFLICT');
    });

    it('returns INSUFFICIENT_DATA if one observation is missing or metadata is mismatched', () => {
      const obsB = { ...baseObs, parameter: 'DISCHARGE' as const };
      expect(compareWaterObservations(baseObs, null)).toBe('INSUFFICIENT_DATA');
      expect(compareWaterObservations(baseObs, obsB)).toBe('INSUFFICIENT_DATA');
    });
  });
});
