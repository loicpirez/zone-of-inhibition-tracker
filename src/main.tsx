/**
 * @file main.tsx
 * This file serves as the entry point for the React application.
 * It initializes the application by rendering the root component and setting up providers for routing, state management, and theming.
 */

import './index.css';
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import { Flowbite } from 'flowbite-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import AppRoutes from './routes';
import theme from './theme';
import Layout from './components/Layout';
import './i18n';

if (!import.meta.env.VITE_ZOIT_API_URL) {
	throw new Error('VITE_ZOIT_API_URL is not set');
}

if (process.env.NODE_ENV === 'testing') {
	const { worker } = await import('./mocks/browser');
	await worker.start();
}

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
	throw new Error('Root element not found');
}

/**
 * Renders the root component of the application.
 * It wraps the application with providers for routing, query management, theming, and layout.
 */
createRoot(rootElement).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Flowbite theme={{ theme }}>
					<Layout>
						<AppRoutes />
					</Layout>
				</Flowbite>
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
);