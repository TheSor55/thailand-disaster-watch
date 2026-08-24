import { gistdaFloodFreshness } from './freshness';
import type { GistdaTileMetadata } from './types';

export function normalizeGistdaTileMetadata(retrievedAt: string): GistdaTileMetadata {
  return {
    provider: 'GISTDA',
    datasetId: 'gistda-disaster-flood-1day-tms',
    dataType: 'OBSERVED',
    observedAt: null,
    retrievedAt,
    freshness: gistdaFloodFreshness(),
    attribution: 'GISTDA',
    productionStatus: 'PENDING',
  };
}
