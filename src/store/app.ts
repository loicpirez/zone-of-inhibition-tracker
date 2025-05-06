/**
 * @file app.ts
 * This file defines the global application state using Zustand.
 * It includes state variables and methods for managing file-related data and error handling.
 */

import { create } from 'zustand';
import { AppState } from '../types/store';
import { FileResponse } from '../types/api';

/**
 * Initial state variables for the application.
 *
 * @constant
 * @type {Object}
 * @property {string | null} fileId - The ID of the currently selected file.
 * @property {{ message: string; code: string } | null} error - The current error state.
 * @property {FileResponse[]} fileList - The list of files fetched from the API.
 */
export const variables = {
	fileId: null as string | null,
	error: null as { message: string; code: string } | null,
	fileList: [] as FileResponse[],
};

/**
 * Zustand store for managing the global application state.
 *
 * @function useAppStore
 * @returns {AppState & typeof variables} - The Zustand store with state variables and actions.
 *
 * @example
 * ```typescript
 * import { useAppStore } from './app';
 *
 * const { fileId, setFileId } = useAppStore();
 * setFileId('123');
 * console.log(fileId); // '123'
 * ```
 */
export const useAppStore = create<AppState & typeof variables>((set) => ({
	...variables,

	/**
	 * Sets the ID of the currently selected file.
	 *
	 * @param {string | null} id - The file ID to set.
	 */
	setFileId: (id: string | null) => set({ fileId: id }),

	/**
	 * Resets the file ID to null.
	 */
	resetFileId: () => set({ fileId: null }),

	/**
	 * Sets the current error state.
	 *
	 * @param {{ message: string; code: string } | null} error - The error object to set.
	 */
	setError: (error: { message: string; code: string } | null) => set({ error }),

	/**
	 * Resets the error state to null.
	 */
	resetError: () => set({ error: null }),

	/**
	 * Sets the list of files fetched from the API.
	 *
	 * @param {FileResponse[]} fileList - The list of files to set.
	 */
	setFileList: (fileList: FileResponse[]) => set({ fileList }),

	/**
	 * Adds a new file to the beginning of the file list.
	 *
	 * @param {FileResponse} file - The file to add.
	 */
	addFileToList: (file: FileResponse) => set((state) => ({ fileList: [file, ...state.fileList] })),
}));
