import { describe, expect, it } from 'vitest';
import worker from './index';

describe('Worker HTTP Router Integration', () => {
  it('includes open_meteo status in the health response', async () => {
    const request = new Request('https://worker.local/api/health');
    const env = {
      OPEN_METEO_PILOT_ENABLED: 'true',
    };
    const response = await worker.fetch(
      request,
      env as unknown as Parameters<typeof worker.fetch>[1]
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as Record<string, Record<string, Record<string, unknown>>>;
    expect(body.providers.open_meteo).toBeDefined();
    expect(body.providers.open_meteo.status).toBe('READY_FOR_CONTROLLED_PILOT');
  });

  it('blocks weather situation API when pipeline is disabled', async () => {
    const request = new Request('https://worker.local/api/situation/weather');
    const env = {
      WEATHER_SITUATION_PIPELINE_ENABLED: 'false',
    };
    const response = await worker.fetch(
      request,
      env as unknown as Parameters<typeof worker.fetch>[1]
    );
    expect(response.status).toBe(500);
    const body = (await response.json()) as Record<string, Record<string, string>>;
    expect(body.error.code).toBe('WEATHER_SITUATION_FAILED');
    expect(body.error.message).toContain('Pipeline is currently disabled');
  });
});
