import { describe, expect, it } from 'vitest';
import { fetchWeatherSituation } from './pipeline';

describe('Weather Situation Pipeline Orchestrator', () => {
  const envDisabled = { WEATHER_SITUATION_PIPELINE_ENABLED: 'false' };
  const envEnabled = {
    WEATHER_SITUATION_PIPELINE_ENABLED: 'true',
    TMD_PILOT_ENABLED: 'true',
    TMD_UID: 'test-uid',
    TMD_UKEY: 'test-ukey',
    OPEN_METEO_PILOT_ENABLED: 'true',
  };
  const mockNow = new Date('2026-08-25T13:00:00Z');

  it('is disabled by default and blocks requests', async () => {
    await expect(fetchWeatherSituation(envDisabled)).rejects.toThrowError(
      'Weather Situation Pipeline is currently disabled'
    );
  });

  it('returns both observed and forecast data when both are available and correctly sets answers', async () => {
    const mockFetcher = async (url: unknown) => {
      const urlStr = String(url);
      if (urlStr.includes('data.tmd.go.th')) {
        // Mock TMD response
        return new Response(
          JSON.stringify({
            Header: { LastUpdate: '2026-08-25T19:30+07:00' },
            Stations: [
              {
                StationNumber: '48400',
                StationNameTh: 'กรุงเทพมหานคร',
                Observe: {
                  Temperature: { Value: 28.5 },
                  RelativeHumidity: { Value: 75 },
                  WindSpeed: { Value: 12 },
                },
              },
            ],
          }),
          { status: 200 }
        );
      }
      if (urlStr.includes('api.open-meteo.com')) {
        // Mock Open-Meteo response
        return new Response(
          JSON.stringify({
            latitude: 13.75,
            longitude: 100.5,
            utc_offset_seconds: 25200,
            timezone: 'Asia/Bangkok',
            hourly: {
              time: ['2026-08-25T20:00', '2026-08-25T21:00', '2026-08-25T22:00'],
              precipitation: [0.0, 0.5, 1.2],
              precipitation_probability: [20, 80, 90],
              temperature_2m: [27.5, 28.5, 26.5],
              relative_humidity_2m: [80, 75, 85],
              wind_speed_10m: [10.0, 12.0, 8.0],
            },
          }),
          { status: 200 }
        );
      }
      return new Response(null, { status: 404 });
    };

    const res = await fetchWeatherSituation(envEnabled, {
      fetcher: mockFetcher,
      now: () => mockNow,
      latitude: 13.72,
      longitude: 100.57, // near Bangkok station 48400
    });

    expect(res.situation.location.latitude).toBe(13.72);
    expect(res.situation.location.longitude).toBe(100.57);

    // Observed (TMD)
    expect(res.situation.observed).not.toBeNull();
    expect(res.situation.observed!.source).toBe('TMD');
    expect(res.situation.observed!.temperatureCelsius).toBe(28.5);
    expect(res.situation.observed!.freshness).toBe('UNKNOWN');
    expect(res.situation.observed!.provenance).toBe('TMD weather station observation');

    // Forecast (Open-Meteo)
    expect(res.situation.forecast).not.toBeNull();
    expect(res.situation.forecast!.source).toBe('Open-Meteo');
    expect(res.situation.forecast!.precipitationMm).toBe(0.5);
    expect(res.situation.forecast!.precipitationProbabilityPercent).toBe(80);
    expect(res.situation.forecast!.provenance).toBe('Open-Meteo numerical forecast model');

    // Answers
    expect(res.answers.currentRain).toBe('ยังไม่มีข้อมูลสังเกตการณ์ที่ยืนยันได้'); // precipitation null in Weather3Hours
    expect(res.answers.rainIn1h).toBe('แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน 80%');
    expect(res.answers.rainIn3h).toBe('แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน 90%');

    expect(res.situation.sourceAgreement).toBe('INSUFFICIENT_DATA');
    expect(res.situation.confidence).toBe('UNKNOWN');
  });

  it('isolates failures: observed fails but forecast remains available', async () => {
    const mockFetcher = async (url: unknown) => {
      const urlStr = String(url);
      if (urlStr.includes('data.tmd.go.th')) {
        return new Response(null, { status: 500 });
      }
      if (urlStr.includes('api.open-meteo.com')) {
        return new Response(
          JSON.stringify({
            utc_offset_seconds: 25200,
            hourly: {
              time: ['2026-08-25T20:00'],
              precipitation_probability: [35],
            },
          }),
          { status: 200 }
        );
      }
      return new Response(null, { status: 404 });
    };

    const res = await fetchWeatherSituation(envEnabled, {
      fetcher: mockFetcher,
      now: () => mockNow,
    });

    expect(res.situation.observed).toBeNull();
    expect(res.situation.forecast).not.toBeNull();
    expect(res.situation.forecast!.precipitationProbabilityPercent).toBe(35);
    expect(res.answers.currentRain).toBe('ยังไม่มีข้อมูลสังเกตการณ์ที่ยืนยันได้');
    expect(res.answers.rainIn1h).toBe('แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน 35%');
  });

  it('isolates failures: forecast fails but observed remains available', async () => {
    const mockFetcher = async (url: unknown) => {
      const urlStr = String(url);
      if (urlStr.includes('data.tmd.go.th')) {
        return new Response(
          JSON.stringify({
            Header: { LastUpdate: '2026-08-25T19:30+07:00' },
            Stations: [
              {
                StationNumber: '48400',
                StationNameTh: 'กรุงเทพมหานคร',
                Observe: {
                  Temperature: { Value: 27.2 },
                },
              },
            ],
          }),
          { status: 200 }
        );
      }
      if (urlStr.includes('api.open-meteo.com')) {
        return new Response(null, { status: 502 });
      }
      return new Response(null, { status: 404 });
    };

    const res = await fetchWeatherSituation(envEnabled, {
      fetcher: mockFetcher,
      now: () => mockNow,
      latitude: 13.72,
      longitude: 100.57,
    });

    expect(res.situation.observed).not.toBeNull();
    expect(res.situation.observed!.temperatureCelsius).toBe(27.2);
    expect(res.situation.forecast).toBeNull();
    expect(res.answers.currentRain).toBe('ยังไม่มีข้อมูลสังเกตการณ์ที่ยืนยันได้');
    expect(res.answers.rainIn1h).toBe('ยังไม่มีข้อมูลพยากรณ์ที่ยืนยันได้');
  });

  it('handles both unavailable cleanly without crashing', async () => {
    const mockFetcher = async () => {
      return new Response(null, { status: 500 });
    };

    const res = await fetchWeatherSituation(envEnabled, {
      fetcher: mockFetcher,
      now: () => mockNow,
    });

    expect(res.situation.observed).toBeNull();
    expect(res.situation.forecast).toBeNull();
    expect(res.answers.currentRain).toBe('ยังไม่มีข้อมูลสังเกตการณ์ที่ยืนยันได้');
    expect(res.answers.rainIn1h).toBe('ยังไม่มีข้อมูลพยากรณ์ที่ยืนยันได้');
  });
});
