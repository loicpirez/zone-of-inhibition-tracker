import { showToast } from '../../utils/toast';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

vi.mock('react-toastify', async() => {
	const mockReactToastify = await import('../__mocks__/react-toastify');
	return mockReactToastify.default;
});

describe('showToast', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	test('calls toast with correct arguments', () => {
		showToast('Test message', 'success', 'bottom-left');

		expect(toast).toHaveBeenCalledWith(
			'Test message',
			expect.objectContaining({
				type: 'success',
				position: 'bottom-left',
				autoClose: 2000,
			})
		);
	});

	test('uses default type and position', () => {
		showToast('Test message');

		expect(toast).toHaveBeenCalledWith(
			'Test message',
			expect.objectContaining({
				type: 'info',
				position: 'bottom-left',
				autoClose: 2000,
			})
		);
	});

	test('calls toast with error type', () => {
		showToast('Error message', 'error');

		expect(toast).toHaveBeenCalledWith(
			'Error message',
			expect.objectContaining({
				type: 'error',
				position: 'bottom-left',
				autoClose: 2000,
			})
		);
	});
});
