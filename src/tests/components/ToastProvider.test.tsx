import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ToastProvider } from '../../components/Layout/ToastProvider';

describe('ToastProvider Component', () => {
	it('renders ToastContainer', async() => {
		render(<ToastProvider />);

		const toastContainer = document.querySelector('.Toastify');
		expect(toastContainer).toBeInTheDocument();
	});

	it('renders without crashing', () => {
		const { container } = render(<ToastProvider />);
		expect(container.firstChild).toBeInTheDocument();
	});
});
