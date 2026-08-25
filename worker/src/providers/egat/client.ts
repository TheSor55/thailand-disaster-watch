import { EgatProviderError } from './errors';
import type { EgatEnv, EgatPilotStatus, EgatObservationResult } from './types';

export function egatPilotStatus(env: EgatEnv): EgatPilotStatus {
  if (env.EGAT_PILOT_ENABLED !== 'true') return 'DISABLED';
  return 'READY_FOR_CONTROLLED_PILOT';
}

export async function fetchEgatWaterData(env: EgatEnv): Promise<EgatObservationResult> {
  const status = egatPilotStatus(env);
  if (status !== 'READY_FOR_CONTROLLED_PILOT') {
    throw new EgatProviderError('EGAT_PILOT_DISABLED', 503, 'EGAT Telemetry Pilot is currently disabled');
  }
  throw new EgatProviderError('EGAT_UNAVAILABLE', 503, 'EGAT operational connection pending');
}
