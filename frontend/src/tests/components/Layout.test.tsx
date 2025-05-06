import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Layout from '../../components/Layout';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('react-i18next', async () => {
	const mockReactI18next = await import('../__mocks__/react-i18next');
	return mockReactI18next.default;
});

describe('Layout Component', () => {
	test('renders children correctly', () => {
		render(
			<BrowserRouter>
				<Layout>
					<div>Test Child</div>
				</Layout>
			</BrowserRouter>
		);
		expect(screen.getByText('Test Child')).toBeInTheDocument();
	});

	test('applies correct classes', () => {
		const { container } = render(
			<BrowserRouter>
				<Layout>
					<div>Test Child</div>
				</Layout>
			</BrowserRouter>
		);
		expect(container.firstChild).toHaveClass('bg-gray-100');
	});

	test('renders Navbar component', () => {
		render(
			<BrowserRouter>
				<Layout>
					<div>Test Child</div>
				</Layout>
			</BrowserRouter>
		);
		expect(screen.getByText(/navbar.home/i)).toBeInTheDocument();
	});

	test('renders ToastProvider component', () => {
		render(
			<BrowserRouter>
				<Layout>
					<div>Test Child</div>
				</Layout>
			</BrowserRouter>
		);
		const toastContainer = document.querySelector('.Toastify');
		expect(toastContainer).toBeInTheDocument();
	});
});
