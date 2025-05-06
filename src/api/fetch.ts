/**
 * @file fetch.ts
 * This file contains a utility function for making API GET requests using Axios.
 * It handles errors and throws a custom error when the request fails.
 */

import { AxiosError } from 'axios';
import { CustomError } from '../types/api';
import api from '.';

/**
 * Fetches data from the specified API endpoint.
 *
 * @template T - The expected type of the response data.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {string} errorMessage - The default error message to use if the request fails.
 * @param {string} [token] - Optional Bearer token for authorization.
 * @returns {Promise<T>} - A promise that resolves to the response data of type T.
 * @throws {CustomError} - Throws a `CustomError` if the request fails.
 *
 * @example
 * ```typescript
 * interface User {
 *   id: number;
 *   name: string;
 * }
 *
 * const user = await fetchData<User>('/users/1', 'Failed to fetch user data');
 * console.log(user.name);
 * ```
 */
export const fetchData = async <T>(
	endpoint: string,
	errorMessage: string,
	token?: string
): Promise<T> => {
	try {
		const headers = token ? { Authorization: `Bearer ${token}` } : {};
		const response = await api.get<T>(endpoint, { headers });

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const { response } = error;

			if (response?.data?.error?.message) {
				throw new CustomError(response.data.error.message, response.status, response.data);
			}

			throw new CustomError(errorMessage, response?.status || 500, response?.data);
		}

		throw new CustomError(errorMessage, 500, null);
	}
};