import { TmdProviderError } from './errors';
import type { TmdEnv, TmdPilotStatus, TmdObservationResult } from './types';

export function tmdPilotStatus(env: TmdEnv): TmdPilotStatus {
  if (env.TMD_PILOT_ENABLED !== 'true') return 'DISABLED';
  if (!env.TMD_API_KEY) return 'CONFIGURATION_REQUIRED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchTmdWeatherData(env: TmdEnv): Promise<TmdObservationResult> {
  const status = tmdPilotStatus(env);
  if (status !== 'READY_FOR_CONTROLLED_PILOT') {
    throw new TmdProviderError('TMD_PILOT_DISABLED', 503, 'TMD Weather Pilot is currently disabled or unconfigured');
  }
  throw new TmdProviderError('TMD_UNAVAILABLE', 503, 'TMD operational connection pending');
}
