import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('static security header baseline', () => {
  it('fails closed for framing and restricts external runtime resources', async () => {
    const headers = await readFile(resolve(process.cwd(), 'public/_headers'), 'utf8');
    expect(headers).toContain("default-src 'self'");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin');
    expect(headers).toContain('Permissions-Policy:');
    expect(headers).toContain('https://tile.openstreetmap.org');
    expect(headers).not.toMatch(/api-gateway\.gistda\.or\.th/);
  });
});
