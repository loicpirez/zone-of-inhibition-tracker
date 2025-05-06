/**
 * @file index.tsx
 * This file defines the `FileComponent`, which displays detailed information about a specific file.
 * It includes file metadata, diameters, and a download link.
 */

import React, { useEffect } from 'react';
import { useFileDetails } from '../../api/queries';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useAppStore } from '../../store/app';
import { FileResponse } from '../../types/api';

/**
 * The `FileComponent` displays detailed information about a specific file, including its metadata,
 * diameters, and a download link. It handles loading and error states.
 *
 * @component
 * @returns {JSX.Element} - The rendered `FileComponent`.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import FileComponent from './File';
 *
 * const App = () => <FileComponent />;
 * export default App;
 * ```
 */
const FileComponent: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const { data: fileDetails, isLoading, isError } = useFileDetails(id || '');
	const { resetError } = useAppStore();

	useEffect(() => {
		resetError();
	}, [resetError]);

	if (isLoading) {
		return (
			<div data-testid="loading-state" className="flex items-center justify-center bg-gray-100">
				<p className="text-lg text-gray-600">{t('loading')}</p>
			</div>
		);
	}

	if (isError || !fileDetails?.data?.file) {
		return (
			<div data-testid="error-state" className="flex items-center justify-center bg-gray-100">
				<p className="text-lg text-red-600">{t('error.fetching', { resource: t('zoit.api') })}</p>
			</div>
		);
	}

	const file: FileResponse = fileDetails.data.file;

	const { id: fileId, originalName, mimeType, size, createdAt, diameters } = file;

	const downloadUrl = `${import.meta.env.VITE_ZOIT_API_URL}/api/file/download/${fileId}`;

	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 p-6">
			<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
				<h1
					data-testid="file-name"
					id="file-name"
					className="text-2xl font-bold text-blue-600 mb-4 text-center"
				>
					{originalName}
				</h1>
				<div className="flex justify-center mb-6">
					<img
						src={downloadUrl}
						alt={originalName}
						className="w-48 h-auto border rounded-lg shadow-md"
					/>
				</div>
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-gray-700 mb-2">{t('file.diameters')}</h2>
					<ul data-testid="file-diameters" className="list-disc list-inside text-gray-600">
						{diameters?.length ? (
							diameters.map((d) => (
								<li
									data-testid={`diameter-disk-${d.disk}`}
									key={d.disk}
									id={`diameter-disk-${d.disk}`}
								>
									<strong>{t('file.disk', { number: d.disk })}:</strong> {d.diameterMm} mm
								</li>
							))
						) : (
							<li data-testid="no-diameters">{t('file.no-diameters')}</li>
						)}
					</ul>
				</div>
				<div className="mb-6">
					<h2 className="text-lg font-semibold text-gray-700 mb-2">{t('file.info')}</h2>
					<ul className="text-gray-600">
						<li data-testid="file-id">
							<strong>{t('file.id')}:</strong> {fileId}
						</li>
						<li data-testid="file-type">
							<strong>{t('file.type')}:</strong> {mimeType}
						</li>
						<li data-testid="file-size">
							<strong>{t('file.size')}:</strong> {size} {t('file.bytes')}
						</li>
						<li data-testid="file-created-at">
							<strong>{t('file.created-at')}:</strong> {new Date(createdAt).toLocaleString()}
						</li>
					</ul>
				</div>
				<div className="flex justify-center">
					<a
						href={downloadUrl}
						download={originalName}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						{t('file.download')}
					</a>
				</div>
			</div>
		</div>
	);
};

export default FileComponent;
