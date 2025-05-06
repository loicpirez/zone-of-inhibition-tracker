/**
 * @file index.tsx
 * This file defines the `FileUpload` component, which allows users to upload files to the server.
 * It includes file selection, upload handling, and error handling with feedback.
 */

import React, { useState } from 'react';
import { uploadFile } from '../../api/mutations';
import { showToast } from '../../utils/toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAppStore } from '../../store/app';
import { getUserFriendlyError } from '../../utils/errorHandler';

/**
 * The `FileUpload` component allows users to upload files to the server.
 * It provides a file input, upload button, and feedback for success or error states.
 *
 * @component
 * @returns {JSX.Element} - The rendered `FileUpload` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import FileUpload from './FileUpload';
 *
 * const App = () => <FileUpload />;
 * export default App;
 * ```
 */
const FileUpload: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { setFileId, setError, addFileToList } = useAppStore();

	/**
	 * Handles file selection from the input.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
	 */
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	/**
	 * Handles the file upload process.
	 *
	 * @async
	 * @function handleUpload
	 * @throws {Error} - Throws an error if the upload fails.
	 */
	const handleUpload = async() => {
		if (!file) {
			showToast(t('error.no-file'), 'error');
			return;
		}

		try {
			const response = await uploadFile(file);
			const newFile = {
				id: response.id,
				originalName: file.name,
				size: file.size,
				mimeType: file.type,
				createdAt: new Date().toISOString(),
			};
			addFileToList(newFile);
			setFileId(response.id);
			showToast(t('file.upload-success'), 'success');
			navigate(`/file/${response.id}`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				const typedError = error as { message: string; code?: string };
				const errorCode = typedError.code || 'UNKNOWN';
		
				setError({ message: typedError.message, code: errorCode });
		
				const friendlyMessage = getUserFriendlyError(errorCode, t);
				showToast(friendlyMessage, 'error');
			} else {
				setError({ message: t('error.unexpected'), code: 'UNKNOWN' });
				showToast(t('error.unexpected'), 'error');
			}
		}
	};

	return (
		<div className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-4">
			<h1 className="text-3xl font-bold text-blue-600 mb-6">{t('file.upload')}</h1>
			<div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
				<label
					htmlFor="file-input"
					className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50"
				>
					<svg
						className="w-10 h-10 text-gray-400 mb-2"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 16l4-4m0 0l4 4m-4-4v12M21 8l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					<span className="text-sm text-gray-500">{t('file.upload')}</span>
					<input
						id="file-input"
						type="file"
						accept="image/*"
						capture="environment"
						className="hidden"
						onChange={handleFileChange}
					/>
				</label>
				<p className="text-gray-600 mt-4">{file?.name || t('file.no-file-selected')}</p>
				<button
					onClick={handleUpload}
					className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					{t('file.upload')}
				</button>
			</div>
		</div>
	);
};

export default FileUpload;
