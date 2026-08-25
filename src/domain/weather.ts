export interface WeatherTime {
  observedAt?: string | null;
  issuedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  retrievedAt: string;
}

export interface WeatherObservation {
  provider: string;
  stationId: string;
  temperatureCelsius?: number | null;
  humidityPercent?: number | null;
  windSpeedKph?: number | null;
  time: WeatherTime;
}

export interface WeatherForecast {
  provider: string;
  targetProvince: string;
  temperatureMinCelsius?: number | null;
  temperatureMaxCelsius?: number | null;
  forecastText: string;
  time: WeatherTime;
  // Detailed model forecast parameters (optional)
  precipitationMm?: number | null;
  precipitationProbabilityPercent?: number | null;
  temperatureCelsius?: number | null;
  humidityPercent?: number | null;
  windSpeedKph?: number | null;
}

export interface OfficialWeatherWarning {
  warningId: string;
  title: string;
  description: string;
  level: 'ADVISORY' | 'WARNING' | 'EMERGENCY';
  affectedProvinces: readonly string[];
  time: WeatherTime;
}

export interface RainObservation {
  provider: string;
  stationId: string;
  amountMm: number;
  unit: 'mm';
  time: WeatherTime;
}

export interface RainForecast {
  provider: string;
  targetArea: string;
  expectedAmountMm: number;
  unit: 'mm';
  time: WeatherTime;
}

export interface WeatherSituationLocation {
  latitude: number;
  longitude: number;
  label?: string | null;
}

export interface WeatherSituationObserved {
  source: string;
  observedAt: string | null;
  retrievedAt: string;
  precipitation?: number | null;
  temperatureCelsius?: number | null;
  humidityPercent?: number | null;
  windSpeedKph?: number | null;
  freshness: 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';
  provenance: string;
}

export interface WeatherSituationForecast {
  source: string;
  validAt: string | null;
  retrievedAt: string;
  precipitationMm?: number | null;
  precipitationProbabilityPercent?: number | null;
  temperatureCelsius?: number | null;
  humidityPercent?: number | null;
  windSpeedKph?: number | null;
  freshness: 'FRESH' | 'DELAYED' | 'STALE' | 'UNAVAILABLE' | 'UNKNOWN';
  provenance: string;
}

export interface WeatherSituationWarning {
  present: boolean;
  source: string | null;
  issuedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
}

export interface WeatherSituation {
  location: WeatherSituationLocation;
  generatedAt: string;
  observed: WeatherSituationObserved | null;
  forecast: WeatherSituationForecast | null;
  officialWarning: WeatherSituationWarning | null;
  sourceAgreement: 'CONSISTENT' | 'PARTIAL_AGREEMENT' | 'CONFLICT' | 'INSUFFICIENT_DATA';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA' | 'UNKNOWN';
  limitations: string[];
}
