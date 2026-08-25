import { describe, expect, it } from 'vitest';
import { fetchOpenMeteoForecast, openMeteoPilotStatus } from './client';
import { OpenMeteoProviderError } from './errors';
import type { OpenMeteoFetcher } from './types';

describe('Open-Meteo Provider Client and Normalization', () => {
  describe('Activation Gates', () => {
    it('is disabled by default when OPEN_METEO_PILOT_ENABLED is not set', () => {
      expect(openMeteoPilotStatus({})).toBe('DISABLED');
    });

    it('remains disabled when OPEN_METEO_PILOT_ENABLED is false', () => {
      expect(openMeteoPilotStatus({ OPEN_METEO_PILOT_ENABLED: 'false' })).toBe('DISABLED');
    });

    it('is ready for pilot when pilot is enabled', () => {
      expect(
        openMeteoPilotStatus({ OPEN_METEO_PILOT_ENABLED: 'true' })
      ).toBe('READY_FOR_CONTROLLED_PILOT');
    });

    it('rejects fetch requests when the pilot is disabled', async () => {
      await expect(fetchOpenMeteoForecast({})).rejects.toThrowError(
        new OpenMeteoProviderError('OPEN_METEO_PILOT_DISABLED', 503, 'Open-Meteo Weather Pilot is currently disabled')
      );
    });
  });

  describe('Controlled Fetch & Normalization', () => {
    const env = { OPEN_METEO_PILOT_ENABLED: 'true' };
    const mockNow = new Date('2026-08-25T13:00:00Z');

    it('successfully parses and normalizes typical hourly Open-Meteo API response', async () => {
      const mockPayload = {
        latitude: 13.75,
        longitude: 100.5,
        utc_offset_seconds: 25200,
        timezone: 'Asia/Bangkok',
        hourly_units: {
          time: 'iso8601',
          precipitation: 'mm',
          precipitation_probability: '%',
          temperature_2m: '°C',
          relative_humidity_2m: '%',
          wind_speed_10m: 'km/h',
        },
        hourly: {
          time: ['2026-08-25T13:00'],
          precipitation: [0.5],
          precipitation_probability: [80],
          temperature_2m: [28.5],
          relative_humidity_2m: [75],
          wind_speed_10m: [12.0],
        },
      };

      const mockFetcher: OpenMeteoFetcher = async (url) => {
        expect(String(url)).toContain('latitude=13.7563');
        expect(String(url)).toContain('longitude=100.5018');
        expect(String(url)).toContain('hourly=precipitation,precipitation_probability,rain,temperature_2m,relative_humidity_2m,wind_speed_10m');
        expect(String(url)).toContain('timezone=Asia%2FBangkok');

        return new Response(JSON.stringify(mockPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      const result = await fetchOpenMeteoForecast(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.provider).toBe('Open-Meteo');
      expect(result.datasetId).toBe('open-meteo-forecast');
      expect(result.dataType).toBe('MODEL_FORECAST');
      expect(result.retrievedAt).toBe(mockNow.toISOString());

      const list = result.forecasts;
      expect(list).toHaveLength(1);

      const f = list[0];
      expect(f.provider).toBe('Open-Meteo');
      expect(f.targetProvince).toBe('Bangkok');
      expect(f.precipitationMm).toBe(0.5);
      expect(f.precipitationProbabilityPercent).toBe(80);
      expect(f.temperatureCelsius).toBe(28.5);
      expect(f.humidityPercent).toBe(75);
      expect(f.windSpeedKph).toBe(12.0);
      expect(f.time.validFrom).toBe('2026-08-25T13:00:00+07:00');
      expect(f.time.issuedAt).toBeNull();
      expect(f.time.retrievedAt).toBe(mockNow.toISOString());
    });

    it('handles alternative or missing variables gracefully', async () => {
      const mockPayload = {
        utc_offset_seconds: 25200,
        hourly: {
          time: ['2026-08-25T13:00'],
          // other fields missing
        },
      };

      const mockFetcher: OpenMeteoFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      const result = await fetchOpenMeteoForecast(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.forecasts).toHaveLength(1);
      const f = result.forecasts[0];
      expect(f.precipitationMm).toBeNull();
      expect(f.temperatureCelsius).toBeNull();
    });

    it('rejects on invalid coordinates in options', async () => {
      await expect(
        fetchOpenMeteoForecast(env, { latitude: 95.0 })
      ).rejects.toThrowError(
        new OpenMeteoProviderError('INVALID_COORDINATES', 400, 'Invalid location coordinates provided')
      );
    });

    it('throws OpenMeteoProviderError when response body is not JSON', async () => {
      const mockFetcher: OpenMeteoFetcher = async () => {
        return new Response('plain text error', { status: 200 });
      };

      await expect(fetchOpenMeteoForecast(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new OpenMeteoProviderError('INVALID_RESPONSE', 502, 'Open-Meteo response body is not valid JSON')
      );
    });

    it('throws OpenMeteoProviderError when response body lacks hourly array', async () => {
      const mockFetcher: OpenMeteoFetcher = async () => {
        return new Response(JSON.stringify({ hourly: {} }), { status: 200 });
      };

      await expect(fetchOpenMeteoForecast(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new OpenMeteoProviderError(
          'INVALID_RESPONSE',
          502,
          'Open-Meteo response schema is malformed (expected hourly forecast arrays)'
        )
      );
    });

    it('maps HTTP errors from upstream appropriately', async () => {
      const badCoordsFetcher: OpenMeteoFetcher = async () => {
        return new Response(null, { status: 400 });
      };

      await expect(
        fetchOpenMeteoForecast(env, { fetcher: badCoordsFetcher })
      ).rejects.toThrowError(
        new OpenMeteoProviderError('INVALID_COORDINATES', 400, 'Invalid location coordinates requested')
      );

      const serverErrorFetcher: OpenMeteoFetcher = async () => {
        return new Response(null, { status: 500 });
      };

      await expect(
        fetchOpenMeteoForecast(env, { fetcher: serverErrorFetcher })
      ).rejects.toThrowError(
        new OpenMeteoProviderError(
          'OPEN_METEO_UNAVAILABLE',
          502,
          'Open-Meteo weather service temporarily unavailable'
        )
      );
    });
  });
});
