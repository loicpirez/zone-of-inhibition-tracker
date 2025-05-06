import { vi } from 'vitest';
import { StoreApi, UseBoundStore } from 'zustand';
import { AppState } from '../../types/store';

export const mockSetFileId = vi.fn();
export const mockResetFileId = vi.fn();
export const mockSetError = vi.fn();
export const mockResetError = vi.fn();

export const useAppStore = vi.fn(() => ({
	fileId: null,
	error: null,
	setFileId: mockSetFileId,
	resetFileId: mockResetFileId,
	setError: mockSetError,
	resetError: mockResetError,
}));

export const mockAppStore = async (importOriginal: UseBoundStore<StoreApi<AppState>>) => {
	const actual = importOriginal();
	return {
		...actual,
		useAppStore: vi.fn(() => ({
			fileId: null,
			error: null,
			setFileId: mockSetFileId,
			resetFileId: mockResetFileId,
			setError: mockSetError,
			resetError: mockResetError,
		})),
	};
};

export default mockAppStore;
