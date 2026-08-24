import { defineConfig, globalIgnores } from 'eslint/config';
import eslint from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  globalIgnores([
    '.next/**',
    '.vinext/**',
    '**/dist/**',
    'node_modules/**',
    'coverage/**',
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['vite.config.ts', 'scripts/**/*.mjs', 'tests/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
]);

export default eslintConfig;
