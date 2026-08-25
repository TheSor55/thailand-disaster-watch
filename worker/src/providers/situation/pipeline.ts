import { fetchTmdWeatherData, tmdPilotStatus } from '../tmd';
import { fetchOpenMeteoForecast, openMeteoPilotStatus } from '../open-meteo';
import type { WeatherSituation, WeatherSituationObserved, WeatherSituationForecast } from '../../../../src/domain/weather';
import type { WeatherSituationResponse } from './types';

// Static location coordinates mapping for key TMD stations
const TMD_STATIONS: Record<string, { lat: number; lon: number }> = {
  '48327': { lat: 18.78, lon: 98.98 }, // Chiang Mai
  '48400': { lat: 13.72, lon: 100.57 }, // Bangkok
};

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
}

interface PipelineOptions {
  fetcher?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  now?: () => Date;
  latitude?: number;
  longitude?: number;
  label?: string | null;
}

export async function fetchWeatherSituation(
  env: Record<string, string | undefined>,
  options: PipelineOptions = {}
): Promise<WeatherSituationResponse> {
  if (env.WEATHER_SITUATION_PIPELINE_ENABLED !== 'true') {
    throw new Error('Weather Situation Pipeline is currently disabled');
  }

  const now = options.now ? options.now() : new Date();
  const lat = options.latitude ?? 13.7563; // Default to Bangkok
  const lon = options.longitude ?? 100.5018;

  let observedObj: WeatherSituationObserved | null = null;
  let forecastObj: WeatherSituationForecast | null = null;
  
  let rainIn1h: string = 'ยังไม่มีข้อมูลพยากรณ์ที่ยืนยันได้';
  let rainIn3h: string = 'ยังไม่มีข้อมูลพยากรณ์ที่ยืนยันได้';

  // 1. Ingest observed weather (TMD)
  if (tmdPilotStatus(env) === 'READY_FOR_CONTROLLED_PILOT') {
    try {
      const tmdResult = await fetchTmdWeatherData(env, {
        fetcher: options.fetcher,
        now: () => now,
      });

      // Find the nearest station in TMD_STATIONS
      let nearestObs = null;
      let minDistance = Infinity;

      for (const obs of tmdResult.observations) {
        const coords = TMD_STATIONS[obs.stationId];
        if (coords) {
          const dist = calculateDistance(lat, lon, coords.lat, coords.lon);
          if (dist < minDistance) {
            minDistance = dist;
            nearestObs = obs;
          }
        }
      }

      // Only map if nearest station is within 1.5 degrees (~150 km)
      if (nearestObs && minDistance < 1.5) {
        observedObj = {
          source: 'TMD',
          observedAt: nearestObs.time.observedAt ?? null,
          retrievedAt: nearestObs.time.retrievedAt,
          precipitation: null, // Weather3Hours does not output rain accumulation volume
          temperatureCelsius: nearestObs.temperatureCelsius ?? null,
          humidityPercent: nearestObs.humidityPercent ?? null,
          windSpeedKph: nearestObs.windSpeedKph ?? null,
          freshness: 'UNKNOWN',
          provenance: 'TMD weather station observation',
        };
      }
    } catch {
      // Provider failure isolation: catch error, observed remains null
    }
  }

  // 2. Ingest forecast (Open-Meteo)
  if (openMeteoPilotStatus(env) === 'READY_FOR_CONTROLLED_PILOT') {
    try {
      const openMeteoResult = await fetchOpenMeteoForecast(env, {
        latitude: lat,
        longitude: lon,
        fetcher: options.fetcher,
        now: () => now,
      });

      const list = openMeteoResult.forecasts;
      const nowMs = now.getTime();

      // Find forecast entry closest to 1 hour ahead
      const target1h = nowMs + 3600 * 1000;
      let best1h = null;
      let minDiff1h = Infinity;

      // Find forecast entry closest to 3 hours ahead
      const target3h = nowMs + 3 * 3600 * 1000;
      let best3h = null;
      let minDiff3h = Infinity;

      for (const f of list) {
        if (!f.time.validFrom) continue;
        const validMs = Date.parse(f.time.validFrom);
        if (isNaN(validMs)) continue;

        const diff1h = Math.abs(validMs - target1h);
        if (diff1h < minDiff1h) {
          minDiff1h = diff1h;
          best1h = f;
        }

        const diff3h = Math.abs(validMs - target3h);
        if (diff3h < minDiff3h) {
          minDiff3h = diff3h;
          best3h = f;
        }
      }

      if (best1h) {
        forecastObj = {
          source: 'Open-Meteo',
          validAt: best1h.time.validFrom ?? null,
          retrievedAt: best1h.time.retrievedAt,
          precipitationMm: best1h.precipitationMm ?? null,
          precipitationProbabilityPercent: best1h.precipitationProbabilityPercent ?? null,
          temperatureCelsius: best1h.temperatureCelsius ?? null,
          humidityPercent: best1h.humidityPercent ?? null,
          windSpeedKph: best1h.windSpeedKph ?? null,
          freshness: 'UNKNOWN',
          provenance: 'Open-Meteo numerical forecast model',
        };

        if (best1h.precipitationProbabilityPercent !== null && best1h.precipitationProbabilityPercent !== undefined) {
          rainIn1h = `แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน ${best1h.precipitationProbabilityPercent}%`;
        }
      }

      if (best3h && best3h.precipitationProbabilityPercent !== null && best3h.precipitationProbabilityPercent !== undefined) {
        rainIn3h = `แบบจำลองพยากรณ์คาดการณ์โอกาสเกิดฝน ${best3h.precipitationProbabilityPercent}%`;
      }
    } catch {
      // Provider failure isolation: catch error, forecast remains null
    }
  }

  // 3. Question-Answer semantics
  const currentRain = observedObj && observedObj.precipitation !== null && observedObj.precipitation !== undefined
    ? observedObj.precipitation > 0
      ? 'ตรวจพบฝนตกในพื้นที่สังเกตการณ์'
      : 'ไม่พบฝนตกในพื้นที่สังเกตการณ์'
    : 'ยังไม่มีข้อมูลสังเกตการณ์ที่ยืนยันได้';

  const situation: WeatherSituation = {
    location: {
      latitude: lat,
      longitude: lon,
      label: options.label || null,
    },
    generatedAt: now.toISOString(),
    observed: observedObj,
    forecast: forecastObj,
    officialWarning: {
      present: false,
      source: null,
      issuedAt: null,
      validFrom: null,
      validTo: null,
    },
    sourceAgreement: 'INSUFFICIENT_DATA', // Forecast vs Observed are not directly time-comparable
    confidence: 'UNKNOWN',
    limitations: [
      'TMD credentials may be unconfigured',
      'Rain nowcasting is not enabled',
    ],
  };

  return {
    situation,
    answers: {
      currentRain,
      rainIn1h,
      rainIn3h,
    },
  };
}
