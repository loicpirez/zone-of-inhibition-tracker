import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { FileDetailsResponse } from '../../types/api';

vi.mock('react-i18next', async() => {
	const mockReactI18next = await import('../__mocks__/react-i18next');
	return mockReactI18next.default;
});

vi.mock('../../api/queries', async() => {
	const queries = await import('../../api/queries');
	return {
		...queries,
		useFileDetails: vi.fn(),
	};
});

vi.mock('../../store/app', () => ({
	useAppStore: vi.fn(() => ({
		resetError: vi.fn(),
	})),
}));

import FileComponent from '../../components/File';
import { useFileDetails } from '../../api/queries';

const queryClient = new QueryClient();

describe('FileComponent', () => {
	it('renders loading state', () => {
		vi.mocked(useFileDetails).mockReturnValue({
			isLoading: true,
			isError: false,
			data: null,
		} as UseQueryResult<null, unknown>);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<FileComponent />
				</MemoryRouter>
			</QueryClientProvider>
		);

		expect(screen.getByText('loading')).toBeInTheDocument();
	});

	it('renders error state', () => {
		vi.mocked(useFileDetails).mockReturnValue({
			isLoading: false,
			isError: true,
			data: null,
			error: new Error('error.fetching'),
		} as UseQueryResult<null, Error>);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<FileComponent />
				</MemoryRouter>
			</QueryClientProvider>
		);

		expect(screen.getByText(/error.fetching/)).toBeInTheDocument();
	});

	it('renders file details', () => {
		const mockFileData = {
			id: 'file-id',
			originalName: 'file-name.png',
			mimeType: 'image/png',
			size: 1409247,
			createdAt: '2025-05-06T02:02:31.000Z',
			diameters: [
				{ disk: 1, diameterMm: 29 },
				{ disk: 2, diameterMm: 28 },
			],
		};

		vi.mocked(useFileDetails).mockReturnValue({
			isLoading: false,
			isError: false,
			data: { data: { file: mockFileData } },
		} as UseQueryResult<FileDetailsResponse, unknown>);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<FileComponent />
				</MemoryRouter>
			</QueryClientProvider>
		);

		expect(screen.getByTestId('file-name')).toHaveTextContent(mockFileData.originalName);
		expect(screen.getByTestId('diameter-disk-1')).toHaveTextContent('29 mm');
		expect(screen.getByTestId('diameter-disk-2')).toHaveTextContent('28 mm');
		expect(screen.getByTestId('file-id')).toHaveTextContent(mockFileData.id);
		expect(screen.getByTestId('file-type')).toHaveTextContent(mockFileData.mimeType);
		expect(screen.getByTestId('file-size')).toHaveTextContent(
			`file.size: ${mockFileData.size} file.bytes`
		);
		expect(screen.getByTestId('file-created-at')).toHaveTextContent(
			new Date(mockFileData.createdAt).toLocaleString()
		);
	});

	it('renders fallback when no diameters are available', () => {
		const mockFileData = {
			id: 'file-id',
			originalName: 'file-name.png',
			mimeType: 'image/png',
			size: 1409247,
			createdAt: '2025-05-06T02:02:31.000Z',
			diameters: [],
		};

		vi.mocked(useFileDetails).mockReturnValue({
			isLoading: false,
			isError: false,
			data: { data: { file: mockFileData } },
		} as UseQueryResult<FileDetailsResponse, unknown>);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<FileComponent />
				</MemoryRouter>
			</QueryClientProvider>
		);

		expect(screen.getByText('file.no-diameters')).toBeInTheDocument();
	});

	it('renders download link with correct attributes', () => {
		const mockFileData = {
			id: 'file-id',
			originalName: 'file-name.png',
			mimeType: 'image/png',
			size: 1409247,
			createdAt: '2025-05-06T02:02:31.000Z',
			diameters: [],
		};

		vi.mocked(useFileDetails).mockReturnValue({
			isLoading: false,
			isError: false,
			data: { data: { file: mockFileData } },
		} as UseQueryResult<FileDetailsResponse, unknown>);

		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<FileComponent />
				</MemoryRouter>
			</QueryClientProvider>
		);

		const downloadLink = screen.getByText('file.download');
		expect(downloadLink).toHaveAttribute(
			'href',
			`${import.meta.env.VITE_ZOIT_API_URL}/api/file/download/${mockFileData.id}`
		);
		expect(downloadLink).toHaveAttribute('download', mockFileData.originalName);
	});
});