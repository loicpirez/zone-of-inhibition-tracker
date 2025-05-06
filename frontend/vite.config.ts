import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					react: ['react', 'react-dom'],
					i18n: ['i18next', 'react-i18next'],
					router: ['react-router'],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/tests/setup.ts',
		coverage: {
			provider: 'v8',
			exclude: [
				'tailwind.config.js',
				'vite.config.ts',
				'jest.config.ts',
				'eslint.config.js',
				'public/mockServiceWorker.js',
				'src/vite-env.d.ts',
				'src/mocks/browser.ts',
				'src/mocks/server.ts',
				'src/mocks/handlers.ts',
				'src/types/**/*',
				'src/theme.ts',
				'src/routes.tsx',
				'src/main.tsx',
				'src/i18n.ts',
				'node_modules',
				'dist',
				'src/tests/__mocks__/**/*',
			],
		},
	},
});
