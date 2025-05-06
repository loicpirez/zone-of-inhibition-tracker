import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import query from '@tanstack/eslint-plugin-query';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		plugins: {
			js,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			query,
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		extends: [
			'js/recommended',
			...tseslint.configs.recommended,
			...tseslint.configs.strict
		],
		rules: {
			'array-bracket-spacing': ['error', 'never'],
			camelcase: ['error', { properties: 'never' }],
			indent: ['error', 'tab'],
			'block-spacing': ['error', 'always'],
			'comma-spacing': ['error', { before: false, after: true }],
			'key-spacing': ['error', { beforeColon: false, afterColon: true }],
			'brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'keyword-spacing': ['error', { before: true, after: true }],
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'sort-imports': [
				'error',
				{
					ignoreCase: false,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				},
			],
			'space-before-blocks': ['error', 'always'],
			'space-before-function-paren': ['error', 'never'],
			'space-in-parens': ['error', 'never'],
			'space-infix-ops': 'error',
			eqeqeq: ['error', 'always'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],

			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		},
	},
	{
		files: ['tailwind.config.js'],
		languageOptions: {
			globals: globals.node,
		},
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
]);
