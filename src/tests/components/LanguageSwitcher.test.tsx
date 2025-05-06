import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LanguageSwitcher from '../../components/Navbar/LanguageSwitcher';
import { vi } from 'vitest';
import { mockChangeLanguage } from '../__mocks__/react-i18next';
import '@testing-library/jest-dom';

vi.mock('react-i18next', async() => {
	const mockReactI18next = await import('../__mocks__/react-i18next');
	return mockReactI18next.default;
});

describe('LanguageSwitcher Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders language options', async() => {
		render(<LanguageSwitcher />);

		await act(async() => {
			fireEvent.click(screen.getByRole('button', { name: /navbar.language/i }));
		});

		await waitFor(() => {
			expect(screen.getByText('日本語')).toBeInTheDocument();
			expect(screen.getByText('English')).toBeInTheDocument();
			expect(screen.getByText('Français')).toBeInTheDocument();
		});
	});

	test('changes language on click for all options', async() => {
		render(<LanguageSwitcher />);

		await act(async() => {
			fireEvent.click(screen.getByRole('button', { name: /navbar.language/i }));
		});

		await waitFor(() => {
			expect(screen.getByText('日本語')).toBeInTheDocument();
		});

		const languages = [
			{ label: '日本語', code: 'ja' },
			{ label: 'English', code: 'en' },
			{ label: 'Français', code: 'fr' },
		];

		for (const { label, code } of languages) {
			await act(async() => {
				fireEvent.click(screen.getByText(label));
			});

			expect(mockChangeLanguage).toHaveBeenCalledWith(code);

			await waitFor(() => {
				expect(screen.queryByText(label)).not.toBeInTheDocument();
			});

			await act(async() => {
				fireEvent.click(screen.getByRole('button', { name: /navbar.language/i }));
			});
		}

		expect(mockChangeLanguage).toHaveBeenCalledTimes(languages.length);
	});

	test('dropdown closes after selection', async() => {
		render(<LanguageSwitcher />);

		await act(async() => {
			fireEvent.click(screen.getByRole('button', { name: /navbar.language/i }));
		});

		await act(async() => {
			fireEvent.click(screen.getByText('日本語'));
		});

		await waitFor(() => {
			expect(screen.queryByText('日本語')).not.toBeInTheDocument();
		});
	});
});
