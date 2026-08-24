import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['tests/project-baseline.test.mjs', 'node_modules/**', 'dist/**'],
    restoreMocks: true,
  },
});
