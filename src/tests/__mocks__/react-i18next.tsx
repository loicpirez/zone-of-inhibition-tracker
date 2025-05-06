import en from '../../../public/locales/en/translation.json';
import { Translations } from '../../types/translations';
import { vi } from 'vitest';

export const translations: Translations = { ...en };
export const mockChangeLanguage = vi.fn();
export const mockInit = vi.fn();

export default {
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string>) =>
			options ? `${key} ${JSON.stringify(options)}` : key,
		i18n: {
			changeLanguage: mockChangeLanguage,
			t: (key: string) => {
				return translations[key] || key;
			},
			init: mockInit,
		},
	}),
	Trans: ({ i18nKey, components }: { i18nKey: string; components: JSX.Element[] }) => {
		const translation = translations[i18nKey] || i18nKey;
		return (
			<>
				{translation
					.split(/<0>|<\/0>/)
					.map((part, index) => (index % 2 === 1 ? components[0] : part))}
			</>
		);
	},
};
