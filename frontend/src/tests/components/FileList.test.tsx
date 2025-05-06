import { fireEvent, render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useAppStore } from '../../store/app';
import FileList from '../../components/FileList';
import api from '../../api';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

vi.mock('../../store/app', () => ({
	useAppStore: vi.fn(() => ({
		fileList: [],
		setFileList: vi.fn(),
	})),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
	useNavigate: () => mockNavigate,
}));

vi.mock('../../api', () => ({
	default: {
		delete: vi.fn(),
	},
}));

vi.mock('../../api/fetch', () => ({
	fetchData: vi.fn().mockResolvedValue({ data: [] }),
}));

describe('FileList Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders empty state when no files are available', () => {
		render(<FileList />);

		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
	});

	it('renders file list when files are available', () => {
		(useAppStore as Mock).mockReturnValue({
			fileList: [
				{ id: 'file1', originalName: 'File 1', size: 1024 },
				{ id: 'file2', originalName: 'File 2', size: 2048 },
			],
			setFileList: vi.fn(),
		});

		render(<FileList />);

		expect(screen.getByTestId('file-item-file1')).toBeInTheDocument();
		expect(screen.getByTestId('file-item-file2')).toBeInTheDocument();
		expect(screen.getByText('file.size: 1024 file.bytes')).toBeInTheDocument();
		expect(screen.getByText('file.size: 2048 file.bytes')).toBeInTheDocument();
	});

	it('navigates to file details on file click', () => {
		(useAppStore as Mock).mockReturnValue({
			fileList: [{ id: 'file1', originalName: 'File 1', size: 1024 }],
			setFileList: vi.fn(),
		});

		render(<FileList />);

		fireEvent.click(screen.getByTestId('file-item-file1'));
		expect(mockNavigate).toHaveBeenCalledWith('/file/file1');
	});

	it('shows delete confirmation modal on delete button click', () => {
		(useAppStore as Mock).mockReturnValue({
			fileList: [{ id: 'file1', originalName: 'File 1', size: 1024 }],
			setFileList: vi.fn(),
		});

		render(<FileList />);

		fireEvent.click(screen.getByTestId('delete-button-file1'));
		const modal = screen.getByRole('dialog');
		expect(modal).toBeInTheDocument();
	});

	it('deletes a file successfully', async () => {
		const mockSetFileList = vi.fn();
		(useAppStore as Mock).mockReturnValue({
			fileList: [{ id: 'file1', originalName: 'File 1', size: 1024 }],
			setFileList: mockSetFileList,
		});

		(api.delete as Mock).mockResolvedValueOnce({});

		render(<FileList />);

		fireEvent.click(screen.getByTestId('delete-button-file1'));
		fireEvent.click(screen.getByTestId('confirm-delete-button'));

		expect(api.delete).toHaveBeenCalledWith('/api/file/file1');
	});

	it('shows error message on delete failure', async () => {
		(api.delete as Mock).mockRejectedValueOnce(new Error('Delete failed'));

		render(<FileList />);

		fireEvent.click(screen.getByTestId('delete-button-file1'));
		fireEvent.click(screen.getByTestId('confirm-delete-button'));

		await screen.findByTestId('delete-error-message');

		expect(screen.getByTestId('delete-error-message')).toBeInTheDocument();
	});
});
