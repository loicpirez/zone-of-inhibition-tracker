/**
 * @file index.tsx
 * This file defines the main `App` component, which serves as the entry point for the application.
 * It includes basic layout and text elements with translation support.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * The main `App` component.
 *
 * @component
 * @returns {JSX.Element} - The rendered `App` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import App from './App';
 *
 * const Root = () => <App />;
 * export default Root;
 * ```
 */
const App: React.FC = () => {
	const { t } = useTranslation();

	return (
		<div className="App flex flex-col items-center justify-center flex-grow bg-gray-100">
			{/* Application title */}
			<h1 className="text-4xl font-bold text-blue-600 mb-4">{t('app.welcome')}</h1>

			{/* Navigation prompt */}
			<p className="text-lg text-gray-700 mb-6">{t('app.navigationPrompt')}</p>

			{/* Additional navigation details */}
			<div className="text-center">
				<p className="text-gray-600">{t('app.navigationDetails')}</p>
			</div>
		</div>
	);
};

export default App;
