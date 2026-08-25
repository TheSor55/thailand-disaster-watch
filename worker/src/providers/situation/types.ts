import type { WeatherSituation } from '../../../../src/domain/weather';

export interface WeatherSituationEnv {
  WEATHER_SITUATION_PIPELINE_ENABLED?: string;
}

export interface WeatherSituationResponse {
  situation: WeatherSituation;
  answers: {
    currentRain: string;
    rainIn1h: string;
    rainIn3h: string;
  };
}
