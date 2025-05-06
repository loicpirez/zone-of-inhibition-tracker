/* eslint-disable react-hooks/rules-of-hooks */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Mock, vi } from 'vitest';
import { useApiRoot, useFileDetails, useFileDownload, useFileList } from '../../api/queries';
import { fetchData } from '../../api/fetch';
import { ReactNode } from 'react';

vi.mock('react-i18next', async () => {
	const mockReactI18next = await import('../__mocks__/react-i18next');
	return mockReactI18next.default;
});

vi.mock('../../api/fetch', () => ({
	fetchData: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient();
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('API Queries', () => {
	const testQueryHook = <T,>({
		hook,
		mockData,
		errorMessage,
	}: {
		hook: () => {
			isSuccess: boolean;
			isLoading: boolean;
			isError: boolean;
			data?: T;
			error?: Error | null;
		};
		mockData: T;
		errorMessage: string;
	}) => {
		it('fetches data successfully', async () => {
			(fetchData as Mock).mockResolvedValueOnce(mockData);

			const { result } = renderHook(() => hook(), { wrapper: createWrapper() });

			await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 2000 });

			expect(result.current.data).toEqual(mockData);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.isError).toBe(false);
		});

		it('handles errors correctly', async () => {
			(fetchData as Mock).mockRejectedValueOnce(new Error(errorMessage));

			const { result } = renderHook(() => hook(), { wrapper: createWrapper() });

			await waitFor(() => {
				expect(result.current.isError).toBe(true);
			});

			expect(result.current.error).toBeInstanceOf(Error);
			expect(result.current.error?.message).toBe(errorMessage);
		});

		it('shows loading state initially', () => {
			(fetchData as Mock).mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => hook(), { wrapper: createWrapper() });

			expect(result.current.isLoading).toBe(true);
			expect(result.current.isSuccess).toBe(false);
		});
	};

	describe('useFileList', () => {
		testQueryHook({
			hook: useFileList,
			mockData: { data: [{ id: 'file1', originalName: 'File 1' }] },
			errorMessage: 'error.fetching {"resource":"api.fileList"}',
		});
	});

	describe('useFileDetails', () => {
		testQueryHook({
			hook: () => useFileDetails('file-id', 'mock-token'),
			mockData: {
				data: {
					file: {
						id: 'file-id',
						originalName: 'File Name',
						size: 1024,
						mimeType: 'image/png',
						createdAt: '2025-05-06T02:02:31.000Z',
					},
				},
			},
			errorMessage: 'error.fetching {"resource":"api.fileDetails"}',
		});
	});

	describe('useFileDownload', () => {
		testQueryHook({
			hook: () => useFileDownload('file-id', 'mock-token'),
			mockData: { fileUrl: 'https://example.com/file' },
			errorMessage: 'error.fetching {"resource":"api.fileDownload"}',
		});
	});

	describe('useApiRoot', () => {
		testQueryHook({
			hook: useApiRoot,
			mockData: { message: 'Welcome to the API' },
			errorMessage: 'error.fetching {"resource":"api.root"}',
		});
	});
});
