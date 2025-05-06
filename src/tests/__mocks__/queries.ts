import { vi } from 'vitest';

export const useFileUpload = vi.fn();
export const useFileDetails = vi.fn();
export const useFileDownload = vi.fn();
export const useApiRoot = vi.fn();

export default {
	useFileUpload,
	useFileDetails,
	useFileDownload,
	useApiRoot,
};
