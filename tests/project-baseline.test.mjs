import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const requiredFiles = [
  'AGENTS.md',
  'README.md',
  'docs/ARCHITECTURE.md',
  'docs/DATA-SOURCES.md',
  'docs/DATA-LICENSE-REGISTRY.md',
  'docs/API-CONTRACT.md',
  'docs/SECURITY.md',
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

test('Worker baseline contains no external provider integration', async () => {
  const worker = await readFile(
    new URL('../worker/src/index.ts', import.meta.url),
    'utf8',
  );

  assert.match(worker, /realDataConnected: false/);
  assert.doesNotMatch(worker, /fetch\(['"]https?:\/\//);
});

test('all candidate data sources remain disabled pending audit', async () => {
  const registry = await readFile(
    new URL('../docs/DATA-SOURCES.md', import.meta.url),
    'utf8',
  );

  assert.doesNotMatch(registry, /\| `APPROVED` \|/);
  assert.match(registry, /No source is approved or connected in PHASE 0/);
});

test('example environment file contains no secret-shaped assignment', async () => {
  const env = await readFile(new URL('../.env.example', import.meta.url), 'utf8');
  const unsafeAssignment =
    /(?:API_KEY|TOKEN|PASSWORD|SECRET)[^\r\n=]*=[ \t]*\S+/i;

  assert.doesNotMatch(env, unsafeAssignment);
});
