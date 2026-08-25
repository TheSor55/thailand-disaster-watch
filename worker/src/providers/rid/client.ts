import { RidProviderError } from './errors';
import type { RidEnv, RidPilotStatus, RidObservationResult } from './types';

export function ridPilotStatus(env: RidEnv): RidPilotStatus {
  if (env.RID_PILOT_ENABLED !== 'true') return 'DISABLED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchRidWaterData(env: RidEnv): Promise<RidObservationResult> {
  const status = ridPilotStatus(env);
  if (status !== 'READY_FOR_CONTROLLED_PILOT') {
    throw new RidProviderError('RID_PILOT_DISABLED', 503, 'RID Water Pilot is currently disabled');
  }
  throw new RidProviderError('RID_UNAVAILABLE', 503, 'RID operational connection pending');
}
