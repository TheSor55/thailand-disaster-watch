import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const workerOutput = fileURLToPath(new URL('../dist/worker/', import.meta.url));
const wranglerCli = fileURLToPath(
  new URL('../node_modules/wrangler/bin/wrangler.js', import.meta.url),
);

const result = spawnSync(
  process.execPath,
  [
    wranglerCli,
    'deploy',
    '--dry-run',
    '--config',
    'worker/wrangler.toml',
    '--outdir',
    workerOutput,
  ],
  {
    cwd: projectRoot,
    env: {
      ...process.env,
      WRANGLER_WRITE_LOGS: 'false',
      WRANGLER_LOG_PATH: '.wrangler/logs',
    },
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
