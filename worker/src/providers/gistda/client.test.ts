import { describe, expect, it, vi } from 'vitest';

import { fetchGistdaFloodTile, gistdaPilotStatus } from './client';
import { GistdaProviderError } from './errors';
import { normalizeGistdaTileMetadata } from './normalize';

const placeholderCredential = 'unit-test-placeholder';

const enabledEnv = {
  GISTDA_PILOT_ENABLED: 'true',
  GISTDA_API_KEY: placeholderCredential,
  GISTDA_REQUEST_TIMEOUT_MS: '100',
};

function expectProviderError(error: unknown, code: string) {
  expect(error).toBeInstanceOf(GistdaProviderError);
  expect((error as GistdaProviderError).code).toBe(code);
}

describe('GISTDA controlled pilot client', () => {
  it('keeps the pilot disabled until configuration is explicitly complete', () => {
    expect(gistdaPilotStatus({})).toBe('DISABLED');
    expect(gistdaPilotStatus({ GISTDA_PILOT_ENABLED: 'true' })).toBe(
      'CONFIGURATION_REQUIRED',
    );
    expect(gistdaPilotStatus(enabledEnv)).toBe('READY_FOR_CONTROLLED_PILOT');
  });

  it('accepts a documented PNG tile and emits non-sensitive audit fields', async () => {
    const logger = vi.fn();
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toMatchObject({ 'API-Key': placeholderCredential });
      return new Response(new Uint8Array([137, 80, 78, 71]), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      });
    });

    const result = await fetchGistdaFloodTile(
      { z: 4, x: 12, y: 7 },
      enabledEnv,
      {
        fetcher,
        logger,
        now: () => new Date('2026-08-24T07:30:00.000Z'),
      },
    );

    expect(result.bytes.byteLength).toBe(4);
    expect(result.metadata).toMatchObject({
      observedAt: null,
      retrievedAt: '2026-08-24T07:30:00.000Z',
      freshness: 'UNKNOWN',
      productionStatus: 'PENDING',
    });
    expect(logger).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'GISTDA', outcome: 'success' }),
    );
    expect(JSON.stringify(logger.mock.calls)).not.toContain(placeholderCredential);
  });

  it('deduplicates concurrent requests for the same tile', async () => {
    const fetcher = vi.fn(async () =>
      new Response(new Uint8Array([137, 80, 78, 71]), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      }),
    );

    await Promise.all([
      fetchGistdaFloodTile({ z: 5, x: 24, y: 15 }, enabledEnv, { fetcher }),
      fetchGistdaFloodTile({ z: 5, x: 24, y: 15 }, enabledEnv, { fetcher }),
    ]);

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([
    [407, 'AUTHENTICATION_FAILED'],
    [401, 'AUTHENTICATION_FAILED'],
    [429, 'RATE_LIMITED'],
    [404, 'NO_DATA'],
    [500, 'GISTDA_UNAVAILABLE'],
  ] as const)('maps upstream status %s to %s', async (status, code) => {
    await fetchGistdaFloodTile({ z: 1, x: 0, y: 0 }, enabledEnv, {
      fetcher: async () => new Response(null, { status }),
    }).then(
      () => expect.unreachable('request should fail'),
      (error: unknown) => expectProviderError(error, code),
    );
  });

  it('rejects invalid content and empty tiles', async () => {
    await fetchGistdaFloodTile({ z: 1, x: 0, y: 0 }, enabledEnv, {
      fetcher: async () =>
        new Response('{}', { headers: { 'content-type': 'application/json' } }),
    }).catch((error: unknown) => expectProviderError(error, 'INVALID_RESPONSE'));

    await fetchGistdaFloodTile({ z: 1, x: 0, y: 0 }, enabledEnv, {
      fetcher: async () =>
        new Response(new Uint8Array(), {
          headers: { 'content-type': 'image/png' },
        }),
    }).catch((error: unknown) => expectProviderError(error, 'INVALID_RESPONSE'));
  });

  it('aborts a request after the configured timeout', async () => {
    await fetchGistdaFloodTile(
      { z: 1, x: 0, y: 0 },
      { ...enabledEnv, GISTDA_REQUEST_TIMEOUT_MS: '1' },
      {
        fetcher: (_input, init) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError')),
            );
          }),
      },
    ).catch((error: unknown) => expectProviderError(error, 'TIMEOUT'));
  });

  it('keeps an unavailable observation timestamp null', () => {
    expect(
      normalizeGistdaTileMetadata('2026-08-24T07:30:00.000Z'),
    ).toMatchObject({ observedAt: null, freshness: 'UNKNOWN' });
  });
});
