import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useFileDetails } from '../../api/queries';
import FileComponent from '../../components/File';

vi.mock('react-router', () => ({
	useParams: () => ({ id: 'file-id' }),
}));

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

vi.mock('../../api/queries', () => ({
	useFileDetails: vi.fn(),
}));

const renderWithMockedData = (mock: Partial<ReturnType<typeof useFileDetails>>) => {
	const defaultMock = {
		isSuccess: false,
		isLoading: false,
		isError: false,
		data: null,
		refetch: vi.fn(),
	};

	const mergedMock = {
		...defaultMock,
		...mock,
	};

	(useFileDetails as Mock).mockReturnValue(mergedMock);
	render(<FileComponent />);
};

describe('FileComponent', () => {
	test('renders error message when data fetching fails', () => {
		renderWithMockedData({ isError: true });
		expect(screen.getByText('error.fetching')).toBeInTheDocument();
	});
	test('renders loading state correctly', () => {
		renderWithMockedData({ isLoading: true });
		expect(screen.getByTestId('loading-state')).toBeInTheDocument();
	});

	test('renders empty state when no file data is available', () => {
		renderWithMockedData({
			isSuccess: true,
			data: { data: { file: null } },
		});

		expect(screen.getByTestId('error-state')).toBeInTheDocument();
	});

	test('renders file details when data fetching succeeds', () => {
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

		renderWithMockedData({
			isSuccess: true,
			data: { data: { file: mockFileData } },
		});

		expect(screen.getByTestId('file-name')).toHaveTextContent(mockFileData.originalName);
		expect(screen.getByTestId('diameter-disk-1')).toHaveTextContent('29 mm');
		expect(screen.getByTestId('diameter-disk-2')).toHaveTextContent('28 mm');
		expect(screen.getByTestId('file-diameters')).toBeInTheDocument();
	});
});
