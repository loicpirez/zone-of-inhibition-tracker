/**
 * @file LanguageSwitcher.tsx
 * This file defines the `LanguageSwitcher` component, which allows users to switch the application's language.
 * It uses `react-i18next` for language management and `flowbite-react` for the dropdown UI.
 */

import { useTranslation } from 'react-i18next';
import { Dropdown } from 'flowbite-react';

/**
 * The `LanguageSwitcher` component provides a dropdown menu for switching the application's language.
 *
 * @component
 * @returns {JSX.Element} - The rendered `LanguageSwitcher` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import LanguageSwitcher from './LanguageSwitcher';
 *
 * const App = () => (
 *   <>
 *     <LanguageSwitcher />
 *     <div>Content goes here</div>
 *   </>
 * );
 * export default App;
 * ```
 */
const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();

	/**
	 * Changes the application's language.
	 *
	 * @param {string} lng - The language code to switch to.
	 */
	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<Dropdown label={i18n.t('navbar.language')} inline className="mt-1">
			<Dropdown.Item onClick={() => changeLanguage('ja')}>日本語</Dropdown.Item>
			<Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
			<Dropdown.Item onClick={() => changeLanguage('fr')}>Français</Dropdown.Item>
		</Dropdown>
	);
};

export default LanguageSwitcher;
