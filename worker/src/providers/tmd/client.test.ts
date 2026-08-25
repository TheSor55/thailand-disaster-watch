import { describe, expect, it } from 'vitest';
import { fetchTmdWeatherData, tmdPilotStatus } from './client';
import { TmdProviderError } from './errors';
import type { TmdFetcher } from './types';

describe('TMD Provider Client and Normalization', () => {
  describe('Activation Gates', () => {
    it('is disabled by default when TMD_PILOT_ENABLED is not set', () => {
      expect(tmdPilotStatus({})).toBe('DISABLED');
    });

    it('remains disabled when TMD_PILOT_ENABLED is false', () => {
      expect(tmdPilotStatus({ TMD_PILOT_ENABLED: 'false' })).toBe('DISABLED');
    });

    it('requires credentials (UID/UKey) even if pilot is enabled', () => {
      expect(tmdPilotStatus({ TMD_PILOT_ENABLED: 'true' })).toBe('CONFIGURATION_REQUIRED');
      expect(tmdPilotStatus({ TMD_PILOT_ENABLED: 'true', TMD_UID: 'user1' })).toBe('CONFIGURATION_REQUIRED');
    });

    it('is ready for pilot when pilot is enabled and credentials are configured', () => {
      expect(
        tmdPilotStatus({ TMD_PILOT_ENABLED: 'true', TMD_UID: 'user1', TMD_UKEY: 'key1' })
      ).toBe('READY_FOR_CONTROLLED_PILOT');
    });

    it('rejects fetch requests when the pilot is disabled', async () => {
      await expect(fetchTmdWeatherData({})).rejects.toThrowError(
        new TmdProviderError('TMD_PILOT_DISABLED', 503, 'TMD Weather Pilot is currently disabled or unconfigured')
      );
    });

    it('rejects fetch requests when authentication is unconfigured', async () => {
      await expect(fetchTmdWeatherData({ TMD_PILOT_ENABLED: 'true' })).rejects.toThrowError(
        new TmdProviderError(
          'AUTHENTICATION_NOT_CONFIGURED',
          401,
          'TMD API credentials (UID/UKey) are missing or unconfigured'
        )
      );
    });
  });

  describe('Controlled Fetch & Normalization', () => {
    const env = { TMD_PILOT_ENABLED: 'true', TMD_UID: 'test-uid', TMD_UKEY: 'test-ukey' };
    const mockNow = new Date('2026-08-25T13:00:00Z');

    it('successfully parses and normalizes typical TMD observed weather API response', async () => {
      const mockPayload = {
        Header: { LastUpdate: '2026-08-25 13:00:00' },
        Stations: [
          {
            StationNumber: '48327',
            StationNameEng: 'Chiang Mai',
            Latitude: 18.78,
            Longitude: 98.98,
            Observe: {
              Time: '2026-08-25 13:00:00',
              Temperature: { Value: 28.5, Unit: 'C' },
              RelativeHumidity: { Value: 75.0, Unit: '%' },
              WindSpeed: { Value: 10.0, Unit: 'Knots' },
            },
          },
        ],
      };

      const mockFetcher: TmdFetcher = async (url) => {
        // Verify credentials query string binding
        expect(String(url)).toContain('uid=test-uid');
        expect(String(url)).toContain('ukey=test-ukey');

        return new Response(JSON.stringify(mockPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      const result = await fetchTmdWeatherData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.provider).toBe('TMD');
      expect(result.datasetId).toBe('tmd-weather-observation');
      expect(result.dataType).toBe('OBSERVED');
      expect(result.retrievedAt).toBe(mockNow.toISOString());

      const obsList = result.observations;
      expect(obsList).toHaveLength(1);

      const obs = obsList[0];
      expect(obs.stationId).toBe('48327');
      expect(obs.stationId).not.toBe('');
      expect(obs.temperatureCelsius).toBe(28.5);
      expect(obs.humidityPercent).toBe(75.0);
      expect(obs.windSpeedKph).toBe(18.52); // 10.0 Knots * 1.852 = 18.52 kph
      expect(obs.time.observedAt).toBe('2026-08-25T13:00:00+07:00');
    });

    it('does not infer missing timestamps, coordinates, or units', async () => {
      const mockPayload = {
        Stations: [
          {
            StationNumber: '48400',
            StationNameEng: 'Bangkok Port',
            // Coordinates missing
            Observe: {
              // Time missing
              Temperature: { Value: 30.0 }, // Unit missing
              WindSpeed: { Value: 5.0, Unit: 'unrecognized' }, // Unrecognized unit
            },
          },
        ],
      };

      const mockFetcher: TmdFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      const result = await fetchTmdWeatherData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.observations).toHaveLength(1);
      const obs = result.observations[0];
      expect(obs.stationId).toBe('48400');
      expect(obs.time.observedAt).toBeNull(); // Missing time stays null
      expect(obs.temperatureCelsius).toBe(30.0);
      expect(obs.windSpeedKph).toBeNull(); // Unrecognized unit remains uncalculated
    });

    it('handles alternative lowercase Stations and Observe key layout', async () => {
      const mockPayload = {
        stations: [
          {
            wmo: '48430',
            name: 'Pattaya',
            observe: {
              time: '2026-08-25 13:00:00',
              temperature: { value: 29.2 },
            },
          },
        ],
      };

      const mockFetcher: TmdFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      const result = await fetchTmdWeatherData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.observations).toHaveLength(1);
      expect(result.observations[0].stationId).toBe('48430');
      expect(result.observations[0].temperatureCelsius).toBe(29.2);
    });

    it('throws TmdProviderError when response body is not JSON', async () => {
      const mockFetcher: TmdFetcher = async () => {
        return new Response('Not Found HTML', { status: 200 });
      };

      await expect(fetchTmdWeatherData(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new TmdProviderError('INVALID_RESPONSE', 502, 'TMD response body is not valid JSON')
      );
    });

    it('throws TmdProviderError when schema is malformed', async () => {
      const mockPayload = { wrong_key: 'no_stations_list' };

      const mockFetcher: TmdFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      await expect(fetchTmdWeatherData(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new TmdProviderError(
          'INVALID_RESPONSE',
          502,
          'TMD response schema is malformed (expected list under Stations key)'
        )
      );
    });

    it('handles HTTP error statuses from upstream appropriately', async () => {
      const mockFetcher: TmdFetcher = async () => {
        return new Response(null, { status: 401 });
      };

      await expect(fetchTmdWeatherData(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new TmdProviderError(
          'AUTHENTICATION_NOT_CONFIGURED',
          401,
          'TMD API credentials (UID/UKey) are invalid or unauthorized'
        )
      );

      const errorFetcher: TmdFetcher = async () => {
        return new Response(null, { status: 500 });
      };

      await expect(fetchTmdWeatherData(env, { fetcher: errorFetcher })).rejects.toThrowError(
        new TmdProviderError('TMD_UNAVAILABLE', 502, 'TMD weather service temporarily unavailable')
      );
    });
  });
});
