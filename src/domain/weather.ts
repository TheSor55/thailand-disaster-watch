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
