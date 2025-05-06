import { useAppStore as realUseAppStore } from '../../store/app';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import { StoreApi, UseBoundStore } from 'zustand';
import { AppState } from '../../types/store';
import mockAppStore, {
	mockResetError,
	mockResetFileId,
	mockSetError,
	mockSetFileId,
	useAppStore as mockUseAppStore,
} from '../__mocks__/store';

describe('mockAppStore', () => {
	it('should mock setFileId function', () => {
		mockUseAppStore().setFileId('mock-file-id');
		expect(mockSetFileId).toHaveBeenCalledWith('mock-file-id');
	});

	it('should mock resetFileId function', () => {
		mockUseAppStore().resetFileId();
		expect(mockResetFileId).toHaveBeenCalled();
	});

	it('should mock setError function', () => {
		const mockError = { message: 'Mock error', code: 'MOCK_ERROR' };
		mockUseAppStore().setError(mockError);
		expect(mockSetError).toHaveBeenCalledWith(mockError);
	});

	it('should mock resetError function', () => {
		mockUseAppStore().resetError();
		expect(mockResetError).toHaveBeenCalled();
	});

	it('should return mocked store', async() => {
		const importOriginal: UseBoundStore<StoreApi<AppState>> = vi.fn(() => ({
			getState: vi.fn(),
			setState: vi.fn(),
			subscribe: vi.fn(),
			destroy: vi.fn(),
		})) as unknown as UseBoundStore<StoreApi<AppState>>;

		const store = await mockAppStore(importOriginal);
		expect(store.useAppStore).toBeDefined();
		expect(store.useAppStore().fileId).toBe(null);
		expect(store.useAppStore().setFileId).toBe(mockSetFileId);
		expect(store.useAppStore().resetFileId).toBe(mockResetFileId);
		expect(store.useAppStore().setError).toBe(mockSetError);
		expect(store.useAppStore().resetError).toBe(mockResetError);
	});

	it('should set fileId using real store', () => {
		const { result } = renderHook(() => realUseAppStore());

		act(() => {
			result.current.setFileId('real-file-id');
		});

		expect(result.current.fileId).toBe('real-file-id');
	});

	it('should reset fileId using real store', () => {
		const { result } = renderHook(() => realUseAppStore());

		act(() => {
			result.current.setFileId('real-file-id');
			result.current.resetFileId();
		});

		expect(result.current.fileId).toBe(null);
	});

	it('should set error using real store', () => {
		const { result } = renderHook(() => realUseAppStore());
		const error = { message: 'Real error', code: 'REAL_ERROR' };

		act(() => {
			result.current.setError(error);
		});

		expect(result.current.error).toEqual(error);
	});

	it('should reset error using real store', () => {
		const { result } = renderHook(() => realUseAppStore());

		act(() => {
			result.current.setError({ message: 'Real error', code: 'REAL_ERROR' });
			result.current.resetError();
		});

		expect(result.current.error).toBe(null);
	});
});
