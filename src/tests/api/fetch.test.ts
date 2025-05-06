import { vi } from 'vitest';
import { fetchData } from '../../api/fetch';
import { FileErrorCode } from '../../types/api';
import api from '../../api/index';

vi.mock('../../api/index', () => ({
	default: {
		get: vi.fn(),
	},
}));

it('should handle 404 error', async() => {
	const errorResponse = {
		response: {
			status: 404,
			data: {
				error: {
					message: 'Error message',
					code: FileErrorCode.FILE_NOT_FOUND,
				},
			},
		},
	};
	(api.get as jest.Mock).mockRejectedValueOnce(errorResponse);

	await expect(fetchData('endpoint', 'Error message')).rejects.toThrow('Error message');
});

it('should handle NO_FILE_UPLOADED error', async() => {
	const errorResponse = {
		response: {
			status: 400,
			data: {
				error: {
					message: 'Error message',
					code: FileErrorCode.NO_FILE_UPLOADED,
				},
			},
		},
	};
	(api.get as jest.Mock).mockRejectedValueOnce(errorResponse);

	await expect(fetchData('endpoint', 'Error message')).rejects.toThrow('Error message');
});
