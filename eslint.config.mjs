import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import prettierConfig from './.prettierrc.mjs';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/**']),
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000', '^node:', '^@?\\w', '^', '^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'prettier/prettier': ['error', prettierConfig],
      '@eslint/no-unused-vars': 'off',
    },
  },
  prettier,
]);

export default eslintConfig;
