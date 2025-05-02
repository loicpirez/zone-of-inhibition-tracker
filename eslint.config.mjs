import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    languageOptions: {
      globals: globals.node,
    },
    extends: ['js/recommended'],
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
]);
