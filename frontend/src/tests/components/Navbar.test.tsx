import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Navbar from '../../components/Navbar';
import { vi } from 'vitest';

vi.mock('react-i18next', async () => {
	const mockReactI18next = await import('../__mocks__/react-i18next');
	return mockReactI18next.default;
});

describe('Navbar Component', () => {
	test('renders Navbar links correctly', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<Navbar />} />
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText('navbar.home')).toBeInTheDocument();
		expect(screen.getByText('navbar.file-upload')).toBeInTheDocument();
	});

	test('highlights the active link', () => {
		render(
			<MemoryRouter initialEntries={['/file-upload']}>
				<Routes>
					<Route path="/" element={<Navbar />} />
					<Route path="/file-upload" element={<Navbar />} />
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByText('navbar.file-upload')).toHaveClass('active');
	});

	test('renders without crashing', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<Navbar />} />
				</Routes>
			</MemoryRouter>
		);
		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});
});
