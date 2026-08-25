import { ThaiWaterProviderError } from './errors';
import type { ThaiWaterEnv, ThaiWaterPilotStatus, ThaiWaterObservationResult } from './types';

export function thaiWaterPilotStatus(env: ThaiWaterEnv): ThaiWaterPilotStatus {
  if (env.THAIWATER_PILOT_ENABLED !== 'true') return 'DISABLED';
  if (!env.THAIWATER_API_TOKEN) return 'CONFIGURATION_REQUIRED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchThaiWaterData(env: ThaiWaterEnv): Promise<ThaiWaterObservationResult> {
  const status = thaiWaterPilotStatus(env);
  if (status !== 'READY_FOR_CONTROLLED_PILOT') {
    throw new ThaiWaterProviderError('THAIWATER_PILOT_DISABLED', 503, 'ThaiWater Pilot is currently disabled or unconfigured');
  }
  throw new ThaiWaterProviderError('THAIWATER_UNAVAILABLE', 503, 'ThaiWater operational connection pending');
}
