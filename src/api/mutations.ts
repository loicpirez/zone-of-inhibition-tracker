/**
 * @file mutations.ts
 * This file contains utility functions for making API POST requests, such as uploading files.
 * It handles errors and throws a custom error when the request fails.
 */

import api from '.';
import { CustomError } from '../types/api';

/**
 * Uploads a file to the server.
 *
 * @async
 * @function uploadFile
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<{ id: string }>} - A promise that resolves to an object containing the uploaded file's ID.
 * @throws {CustomError} - Throws a `CustomError` if the request fails.
 *
 * @example
 * ```typescript
 * const file = new File(['content'], 'example.txt', { type: 'text/plain' });
 * const result = await uploadFile(file);
 * console.log(result.id);
 * ```
 */
export const uploadFile = async(file: File): Promise<{ id: string }> => {
	const formData = new FormData();
	formData.append('file', file);

	try {
		const response = await api.post<{
            message: string;
            file: { id: string };
        }>('/api/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

		return { id: response.data.file.id };
	} catch (error) {
		if (error) {
			const { response } = error;

			if (response?.data?.error?.message) {
				throw new CustomError(response.data.error.message, response.status, response.data);
			}

			throw new CustomError('Unknown error', response?.status || 500, response?.data);
		}
		throw new CustomError('Unexpected error occurred', 500, null);
	}
};