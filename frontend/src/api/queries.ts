/**
 * @file queries.ts
 * This file contains custom React Query hooks for fetching data from the API.
 * It includes reusable query logic and specific hooks for file-related operations.
 */

import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { fetchData } from './fetch';
import { FileResponse } from '../types/api';
import { useTranslation } from 'react-i18next';

const queryConfig = {
	staleTime: 1000 * 60 * 5, // 5 minutes
	retry: false,
};

/**
 * Custom hook for creating a reusable query with translation support.
 *
 * @template T - The expected type of the response data.
 * @param {string} key - The unique key for the query.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {string} translationKey - The translation key for error messages.
 * @param {string} [token] - Optional Bearer token for authorization.
 * @returns {UseQueryResult<T, Error>} - The result of the query.
 */
const useCustomQuery = <T>(
	key: string,
	endpoint: string,
	translationKey: string,
	token?: string
): UseQueryResult<T, Error> => {
	const { t } = useTranslation();
	return useQuery({
		queryKey: [key],
		queryFn: () =>
			fetchData<T>(endpoint, t('error.fetching', { resource: t(translationKey) }), token),
		...queryConfig,
	});
};

/**
 * Hook for fetching the list of files.
 *
 * @returns {UseQueryResult<{ data: FileResponse[] }, Error>} - The result of the query.
 */
export const useFileList = () =>
	useCustomQuery<{ data: FileResponse[] }>('fileList', '/api/file/', 'api.fileList');

/**
 * Hook for fetching the details of a specific file.
 *
 * @param {string} id - The ID of the file.
 * @param {string} [token] - Optional Bearer token for authorization.
 * @returns {UseQueryResult<{ data: { file: FileResponse } }, Error>} - The result of the query.
 */
export const useFileDetails = (id: string, token?: string) =>
	useCustomQuery<{ data: { file: FileResponse } }>(
		`fileDetails-${id}`,
		`/api/file/${id}`,
		'api.fileDetails',
		token
	);

/**
 * Hook for fetching the download URL of a specific file.
 *
 * @param {string} id - The ID of the file.
 * @param {string} [token] - Optional Bearer token for authorization.
 * @returns {UseQueryResult<{ fileUrl: string }, Error>} - The result of the query.
 */
export const useFileDownload = (id: string, token?: string) =>
	useCustomQuery<{ fileUrl: string }>(
		`fileDownload-${id}`,
		`/api/file/download/${id}`,
		'api.fileDownload',
		token
	);

/**
 * Hook for fetching the API root message.
 *
 * @returns {UseQueryResult<{ message: string }, Error>} - The result of the query.
 */
export const useApiRoot = () => useCustomQuery<{ message: string }>('apiRoot', '/api', 'api.root');
