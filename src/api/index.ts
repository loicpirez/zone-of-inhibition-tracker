/**
 * @file index.ts
 * This file initializes and exports an Axios instance for making HTTP requests.
 * The Axios instance is pre-configured with a base URL and default headers.
 */

import axios, { AxiosInstance } from 'axios';

/**
 * Axios instance configured with the base URL and default headers.
 *
 * @constant {AxiosInstance} api
 * @property {string} baseURL - The base URL for API requests, sourced from environment variables.
 * @property {Object} headers - Default headers for all requests, including `Content-Type: application/json`.
 *
 * @example
 * ```typescript
 * import api from './api';
 *
 * const response = await api.get('/endpoint');
 * console.log(response.data);
 * ```
 */
const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_ZOIT_API_URL,
	headers: { 'Content-Type': 'application/json' },
});

export default api;