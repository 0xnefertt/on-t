import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}', '**/src/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  ...nextVitals.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
  })),
  ...nextTypeScript.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx}'],
  })),
);
