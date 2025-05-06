/**
 * @file i18n.ts
 * This file initializes the `i18next` library for internationalization in the application.
 * It uses `react-i18next` for React integration, `i18next-http-backend` for loading translations,
 * and `i18next-browser-languagedetector` for detecting the user's language.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
	.use(HttpBackend) // Loads translations from backend server.
	.use(LanguageDetector) // Detects the user's language from the browser.
	.use(initReactI18next) // Integrates i18next with React.
	.init({
		fallbackLng: 'en', // Default language if detection fails.
		debug: true, // Enables debug mode for development.
		interpolation: {
			escapeValue: false, // Disables escaping for React (not needed).
		},
	});

export default i18n;
