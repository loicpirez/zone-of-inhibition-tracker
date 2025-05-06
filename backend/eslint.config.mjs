import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import typeormTypescriptRecommended from 'eslint-plugin-typeorm-typescript/recommended';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		languageOptions: {
			globals: globals.node,
		},
		extends: ['js/recommended'],
		rules: {
			'array-bracket-spacing': ['error', 'never'],
			'camelcase': ['error', { properties: 'never' }],
			'indent': ['error', 'tab'],
			'keyword-spacing': ['error', { before: true, after: true }],
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],	
			'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }], 
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'sort-imports': [
				'error',
				{
					'ignoreCase': false,
					'ignoreDeclarationSort': true,
					'ignoreMemberSort': false,
					'memberSyntaxSortOrder': ['none', 'all', 'multiple', 'single'],
				},
			],
			'space-before-blocks': ['error', 'always'],
			'space-before-function-paren': ['error', 'never'],
			'space-in-parens': ['error', 'never'],
			'space-infix-ops': 'error',
			eqeqeq: ['error', 'always'],
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					'selector': 'default',
					'format': ['camelCase'],
					'leadingUnderscore': 'allow',
				},
				{
					'selector': 'variable',
					'format': ['camelCase', 'UPPER_CASE'],
					'leadingUnderscore': 'allow'
				},
				{
					'selector': 'typeLike',
					'format': ['PascalCase'],
					'leadingUnderscore': 'allow'
				},
			],		
		},
	},
	{
		files: ['src/constants/**/*.ts', 'src/schemas/environment.ts', '**.mjs'], // Eslint Config, constants and environment should be UPPER_CASE
		rules: {
			'@typescript-eslint/naming-convention': 'off',
		},
	},
	...tseslint.configs.recommended,
	...tseslint.configs.strict,
	typeormTypescriptRecommended,
]);
