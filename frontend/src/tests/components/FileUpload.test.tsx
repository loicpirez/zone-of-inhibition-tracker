import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import FileUpload from '../../components/FileUpload';
import { useAppStore } from '../../store/app';
import { uploadFile } from '../../api/mutations';
import { showToast } from '../../utils/toast';
import { useNavigate } from 'react-router';

vi.mock('../../store/app', () => ({
	useAppStore: vi.fn(() => ({
		setFileId: vi.fn(),
		setError: vi.fn(),
		addFileToList: vi.fn(),
	})),
}));

vi.mock('../../api/mutations', () => ({
	uploadFile: vi.fn(),
}));

vi.mock('../../utils/toast', () => ({
	showToast: vi.fn(),
}));

vi.mock('react-router', () => ({
	useNavigate: vi.fn(),
}));

describe('FileUpload Component', () => {
	const mockSetFileId = vi.fn();
	const mockSetError = vi.fn();
	const mockAddFileToList = vi.fn();
	const mockNavigate = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAppStore as Mock).mockReturnValue({
			setFileId: mockSetFileId,
			setError: mockSetError,
			addFileToList: mockAddFileToList,
		});
		(useNavigate as Mock).mockReturnValue(mockNavigate);
	});

	it('renders correctly', () => {
		render(<FileUpload />);
		expect(screen.getByRole('heading', { name: 'file.upload' })).toBeInTheDocument();
		expect(screen.getByText('file.no-file-selected')).toBeInTheDocument();
	});

	it('shows error toast when no file is selected', () => {
		render(<FileUpload />);

		fireEvent.click(screen.getByRole('button', { name: 'file.upload' }));

		expect(showToast).toHaveBeenCalledWith('error.no-file', 'error');
	});

	it('uploads a file successfully', async() => {
		const mockFile = new File(['file content'], 'test-file.png', { type: 'image/png' });
		(uploadFile as Mock).mockResolvedValueOnce({ id: 'file-id' });

		render(<FileUpload />);

		const fileInput = screen.getByLabelText('file.upload');
		fireEvent.change(fileInput, { target: { files: [mockFile] } });

		fireEvent.click(screen.getByRole('button', { name: 'file.upload' }));

		await waitFor(() => {
			expect(uploadFile).toHaveBeenCalledWith(mockFile);
			expect(mockAddFileToList).toHaveBeenCalledWith({
				id: 'file-id',
				originalName: 'test-file.png',
				size: mockFile.size,
				mimeType: mockFile.type,
				createdAt: expect.any(String),
			});
			expect(mockSetFileId).toHaveBeenCalledWith('file-id');
			expect(showToast).toHaveBeenCalledWith('file.upload-success', 'success');
			expect(mockNavigate).toHaveBeenCalledWith('/file/file-id');
		});
	});

	it('handles upload error gracefully', async() => {
		const mockFile = new File(['file content'], 'test-file.png', { type: 'image/png' });
		(uploadFile as Mock).mockRejectedValueOnce(new Error('Upload failed'));

		render(<FileUpload />);

		const fileInput = screen.getByLabelText('file.upload');
		fireEvent.change(fileInput, { target: { files: [mockFile] } });

		fireEvent.click(screen.getByRole('button', { name: 'file.upload' }));

		await waitFor(() => {
			expect(uploadFile).toHaveBeenCalledWith(mockFile);
			expect(mockSetError).toHaveBeenCalledWith({
				message: 'Upload failed',
				code: 'UNKNOWN',
			});
			expect(showToast).toHaveBeenCalledWith('error.unexpected', 'error');
		});
	});
});
