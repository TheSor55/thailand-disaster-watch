import { describe, expect, it } from 'vitest';
import { fetchRidWaterData, ridPilotStatus } from './client';
import { RidProviderError } from './errors';
import type { RidFetcher } from './types';

describe('RID Provider Client and Normalization', () => {
  describe('Activation Gates', () => {
    it('is disabled by default when RID_PILOT_ENABLED is not set', () => {
      expect(ridPilotStatus({})).toBe('DISABLED');
    });

    it('remains disabled when RID_PILOT_ENABLED is false', () => {
      expect(ridPilotStatus({ RID_PILOT_ENABLED: 'false' })).toBe('DISABLED');
    });

    it('is ready for pilot when RID_PILOT_ENABLED is true', () => {
      expect(ridPilotStatus({ RID_PILOT_ENABLED: 'true' })).toBe('READY_FOR_CONTROLLED_PILOT');
    });

    it('rejects fetch requests when the pilot is disabled', async () => {
      await expect(fetchRidWaterData({})).rejects.toThrowError(
        new RidProviderError('RID_PILOT_DISABLED', 503, 'RID Water Pilot is currently disabled')
      );
    });
  });

  describe('Controlled Fetch & Normalization', () => {
    const env = { RID_PILOT_ENABLED: 'true' };
    const mockNow = new Date('2026-08-25T13:00:00Z');

    it('successfully parses and normalizes typical RID dam public API payloads', async () => {
      const mockPayload = [
        {
          dam_id: '1',
          dam_name: 'Bhumibol',
          dam_date: '2026-08-25',
          volume: 6780.5,
          volume_unit: 'million m3',
          inflow: 25.4,
          inflow_unit: 'million m3/day',
          outflow: 12.0,
          outflow_unit: 'million m3/day',
          latitude: 17.24,
          longitude: 98.97,
        },
      ];

      const mockFetcher: RidFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      };

      const result = await fetchRidWaterData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.provider).toBe('RID');
      expect(result.datasetId).toBe('rid-reservoir-telemetry');
      expect(result.dataType).toBe('OBSERVED');
      expect(result.retrievedAt).toBe(mockNow.toISOString());
      
      const obsList = result.observations;
      expect(obsList).toHaveLength(3); // volume, inflow, outflow

      // Bhumibol storage check
      const storageObs = obsList.find(o => o.parameter === 'RESERVOIR_STORAGE');
      expect(storageObs).toBeDefined();
      expect(storageObs?.stationId).toBe('1');
      expect(storageObs?.stationName).toBe('Bhumibol');
      expect(storageObs?.value).toBe(6780.5);
      expect(storageObs?.unit).toBe('million m3');
      expect(storageObs?.observedAt).toBe('2026-08-25T00:00:00Z');
      expect(storageObs?.latitude).toBe(17.24);
      expect(storageObs?.longitude).toBe(98.97);

      // Inflow check
      const inflowObs = obsList.find(o => o.parameter === 'INFLOW');
      expect(inflowObs?.value).toBe(25.4);
      expect(inflowObs?.unit).toBe('million m3/day');

      // Outflow check
      const outflowObs = obsList.find(o => o.parameter === 'OUTFLOW');
      expect(outflowObs?.value).toBe(12.0);
      expect(outflowObs?.unit).toBe('million m3/day');
    });

    it('does not infer missing timestamps, coordinates, or units', async () => {
      const mockPayload = [
        {
          project_id: '99',
          project_name: 'No Coordinates Reservoir',
          volume: 5.4,
          // dam_date, latitude, longitude, units missing
        },
      ];

      const mockFetcher: RidFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), {
          status: 200,
        });
      };

      const result = await fetchRidWaterData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.observations).toHaveLength(1);
      const obs = result.observations[0];
      expect(obs.stationId).toBe('99');
      expect(obs.latitude).toBe(0);
      expect(obs.longitude).toBe(0);
      expect(obs.observedAt).toBeNull();
      expect(obs.unit).toBe('million m3'); // Default fallback when unit is missing
      expect(obs.freshness).toBe('UNKNOWN');
    });

    it('handles alternative date string layout DD/MM/YYYY', async () => {
      const mockPayload = [
        {
          dam_id: '2',
          dam_name: 'Sirikit',
          observed_date: '25/08/2026',
          volume: 4500.0,
        },
      ];

      const mockFetcher: RidFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      const result = await fetchRidWaterData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.observations[0].observedAt).toBe('2026-08-25T00:00:00Z');
    });

    it('handles wrapped data payloads containing array in data field', async () => {
      const mockPayload = {
        status: 'success',
        data: [
          {
            id: '3',
            name: 'Kwang',
            date: '2026-08-25',
            qty: 15.2,
          },
        ],
      };

      const mockFetcher: RidFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      const result = await fetchRidWaterData(env, {
        fetcher: mockFetcher,
        now: () => mockNow,
      });

      expect(result.observations).toHaveLength(1);
      expect(result.observations[0].stationName).toBe('Kwang');
      expect(result.observations[0].value).toBe(15.2);
    });

    it('throws RidProviderError when response body is not JSON', async () => {
      const mockFetcher: RidFetcher = async () => {
        return new Response('Not Found text', { status: 200 });
      };

      await expect(fetchRidWaterData(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new RidProviderError('INVALID_RESPONSE', 502, 'RID response body is not valid JSON')
      );
    });

    it('throws RidProviderError when schema is malformed', async () => {
      const mockPayload = { wrong_key: 'no_list_here' };

      const mockFetcher: RidFetcher = async () => {
        return new Response(JSON.stringify(mockPayload), { status: 200 });
      };

      await expect(fetchRidWaterData(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new RidProviderError(
          'INVALID_RESPONSE',
          502,
          'RID response schema is malformed (expected array or wrapped data list)'
        )
      );
    });

    it('handles HTTP error statuses from upstream appropriately', async () => {
      const mockFetcher: RidFetcher = async () => {
        return new Response(null, { status: 404 });
      };

      await expect(fetchRidWaterData(env, { fetcher: mockFetcher })).rejects.toThrowError(
        new RidProviderError('NO_DATA', 404, 'No RID telemetry data found')
      );

      const errorFetcher: RidFetcher = async () => {
        return new Response(null, { status: 500 });
      };

      await expect(fetchRidWaterData(env, { fetcher: errorFetcher })).rejects.toThrowError(
        new RidProviderError('RID_UNAVAILABLE', 502, 'RID data service temporarily unavailable')
      );
    });
  });
});
