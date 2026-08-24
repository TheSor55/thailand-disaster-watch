import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'docs/ARCHITECTURE.md',
  'docs/DATA-SOURCES.md',
  'docs/PROVIDER-AUDIT-RECORDS.md',
  'docs/GISTDA-INTEGRATION.md',
  'docs/DATA-LICENSE-REGISTRY.md',
  'docs/API-CONTRACT.md',
  'docs/SECURITY.md',
  'docs/SAFETY-ARCHITECTURE.md',
  'docs/BCM-ARCHITECTURE.md',
  'docs/EXPORT-SHARING.md',
  'docs/SEISMOWATCH-MIGRATION.md',
  'docs/DESIGN-SYSTEM.md',
  'docs/ROADMAP.md',
  'docs/DISCLAIMER.md',
  '.env.example',
  '.github/workflows/ci.yml',
  'src/app/App.tsx',
  'worker/src/index.ts',
  'worker/wrangler.toml',
];

test('PHASE 0 required files are readable', async () => {
  const files = await Promise.all(
    requiredFiles.map((file) => readFile(new URL(`../${file}`, import.meta.url))),
  );

  assert.equal(files.length, requiredFiles.length);
  assert.ok(files.every((file) => file.length > 0));
});

test('production dependency baseline excludes Vinext and Next.js', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  assert.equal(allDependencies.vinext, undefined);
  assert.equal(allDependencies.next, undefined);
  assert.match(packageJson.scripts['build:web'], /vite build/);
  assert.match(packageJson.scripts['build:worker'], /build-worker\.mjs/);
});

test('Worker baseline contains no enabled external provider integration', async () => {
  const worker = await readFile(
    new URL('../worker/src/index.ts', import.meta.url),
    'utf8',
  );

  assert.match(worker, /realDataConnected: false/);
  assert.match(worker, /realDataConnected: false/);
  assert.match(worker, /operationalUseApproved: false/);
});

test('PHASE 2 audit does not enable a live provider', async () => {
  const registry = await readFile(
    new URL('../docs/DATA-SOURCES.md', import.meta.url),
    'utf8',
  );
  const worker = await readFile(
    new URL('../worker/src/index.ts', import.meta.url),
    'utf8',
  );

  assert.match(registry, /Every production adapter remains \*\*disabled\*\*/);
  assert.match(registry, /public CORS proxies/i);
  assert.match(worker, /realDataConnected: false/);
  assert.match(worker, /operationalUseApproved: false/);
});

test('GISTDA pilot remains pending and disabled by default', async () => {
  const integration = await readFile(
    new URL('../docs/GISTDA-INTEGRATION.md', import.meta.url),
    'utf8',
  );
  const env = await readFile(new URL('../.env.example', import.meta.url), 'utf8');

  assert.match(integration, /PENDING — DO NOT USE IN PRODUCTION/);
  assert.match(integration, /observedAt: null/);
  assert.match(env, /^GISTDA_PILOT_ENABLED=false$/m);
  assert.match(env, /^GISTDA_API_KEY=$/m);
  assert.doesNotMatch(env, /^GISTDA_API_KEY=.+$/m);
});

test('governance documentation preserves official authority over AI', async () => {
  const contract = await readFile(
    new URL('../docs/API-CONTRACT.md', import.meta.url),
    'utf8',
  );
  const safety = await readFile(
    new URL('../docs/SAFETY-ARCHITECTURE.md', import.meta.url),
    'utf8',
  );

  assert.match(contract, /OFFICIAL_WARNING > OFFICIAL_OBSERVATION/);
  assert.match(safety, /AI is advisory only/);
  assert.match(safety, /authenticated human approval/);
});

test('example environment file contains no secret-shaped assignment', async () => {
  const env = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
  const unsafeAssignment =
    /(?:API_KEY|TOKEN|PASSWORD|SECRET)[^\r\n=]*=[ \t]*\S+/i;

  assert.doesNotMatch(env, unsafeAssignment);
});
