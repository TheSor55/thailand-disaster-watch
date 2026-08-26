import { describe, expect, it } from 'vitest';
import {
  buildSituationTimeContext,
  compareWeatherAndRadarSources,
} from './intelligence';

describe('Weather & Radar Intelligence Domain Model (Phase 3.5)', () => {
  describe('buildSituationTimeContext', () => {
    it('preserves exact original timestamps and calculates relative delta minutes', () => {
      const refTime = '2026-08-26T12:00:00Z';
      const obsTime = '2026-08-26T11:50:00Z'; // -10 min
      const radarTime = '2026-08-26T11:55:00Z'; // -5 min
      const fc1h = '2026-08-26T13:00:00Z'; // +60 min
      const fc3h = '2026-08-26T15:00:00Z'; // +180 min

      const ctx = buildSituationTimeContext(refTime, obsTime, radarTime, fc1h, fc3h);

      expect(ctx.referenceTime).toBe(refTime);
      expect(ctx.observedTime).toBe(obsTime);
      expect(ctx.observedDeltaMinutes).toBe(-10);
      expect(ctx.radarFrameTime).toBe(radarTime);
      expect(ctx.radarDeltaMinutes).toBe(-5);
      expect(ctx.forecast1hValidTime).toBe(fc1h);
      expect(ctx.forecast1hDeltaMinutes).toBe(60);
      expect(ctx.forecast3hValidTime).toBe(fc3h);
      expect(ctx.forecast3hDeltaMinutes).toBe(180);
    });

    it('handles null and missing timestamps gracefully without throwing', () => {
      const refTime = '2026-08-26T12:00:00Z';
      const ctx = buildSituationTimeContext(refTime, null, undefined, null, null);

      expect(ctx.observedTime).toBeNull();
      expect(ctx.observedDeltaMinutes).toBeNull();
      expect(ctx.radarFrameTime).toBeNull();
      expect(ctx.radarDeltaMinutes).toBeNull();
      expect(ctx.forecast1hValidTime).toBeNull();
      expect(ctx.forecast1hDeltaMinutes).toBeNull();
    });
  });

  describe('compareWeatherAndRadarSources', () => {
    it('returns INSUFFICIENT_DATA when observed data is missing', () => {
      const result = compareWeatherAndRadarSources({
        hasObservedData: false,
        isObservedRaining: null,
        hasForecastData: true,
        forecast1hProb: 75,
        forecast1hPrecipMm: 2.0,
        hasRadarData: true,
      });

      expect(result.state).toBe('INSUFFICIENT_DATA');
      expect(result.confidence).toBe('UNKNOWN');
      expect(result.summaryTh).toContain('ข้อมูลสังเกตการณ์สถานีไม่เพียงพอ');
    });

    it('returns CONSISTENT when station observes rain and model predicts rain in +1h', () => {
      const result = compareWeatherAndRadarSources({
        hasObservedData: true,
        isObservedRaining: true,
        hasForecastData: true,
        forecast1hProb: 80,
        forecast1hPrecipMm: 3.5,
        hasRadarData: true,
      });

      expect(result.state).toBe('CONSISTENT');
      expect(result.confidence).toBe('UNKNOWN');
      expect(result.summaryTh).toContain('ข้อมูลสอดคล้องกัน (พบฝน)');
    });

    it('returns CONSISTENT when station observes dry and model predicts dry in +1h', () => {
      const result = compareWeatherAndRadarSources({
        hasObservedData: true,
        isObservedRaining: false,
        hasForecastData: true,
        forecast1hProb: 10,
        forecast1hPrecipMm: 0,
        hasRadarData: true,
      });

      expect(result.state).toBe('CONSISTENT');
      expect(result.summaryTh).toContain('ข้อมูลสอดคล้องกัน (ไม่มีฝน)');
    });

    it('returns PARTIAL_AGREEMENT when station is dry but model predicts rain in +1h', () => {
      const result = compareWeatherAndRadarSources({
        hasObservedData: true,
        isObservedRaining: false,
        hasForecastData: true,
        forecast1hProb: 65,
        forecast1hPrecipMm: 1.2,
        hasRadarData: true,
      });

      expect(result.state).toBe('PARTIAL_AGREEMENT');
      expect(result.summaryTh).toContain('สถานะต่างช่วงเวลา');
    });

    it('returns CONFLICT when station observes rain but model predicts very dry', () => {
      const result = compareWeatherAndRadarSources({
        hasObservedData: true,
        isObservedRaining: true,
        hasForecastData: true,
        forecast1hProb: 5,
        forecast1hPrecipMm: 0,
        hasRadarData: false,
      });

      expect(result.state).toBe('CONFLICT');
      expect(result.summaryTh).toContain('ข้อมูลมีความขัดแย้ง');
    });
  });
});
