/**
 * @file index.tsx
 * This file defines the `FileList` component, which displays a list of files fetched from the API.
 * It includes functionality for viewing file details and deleting files, with confirmation modals.
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useAppStore } from '../../store/app';
import { fetchData } from '../../api/fetch';
import { FileResponse } from '../../types/api';
import api from '../../api';

/**
 * The `FileList` component displays a list of files fetched from the API.
 * Users can view file details or delete files with confirmation.
 *
 * @component
 * @returns {JSX.Element} - The rendered `FileList` component.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import FileList from './FileList';
 *
 * const App = () => <FileList />;
 * export default App;
 * ```
 */
const FileList: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { fileList, setFileList } = useAppStore();
	const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteError, setDeleteError] = useState(false);

	useEffect(() => {
		const fetchFileList = async() => {
			try {
				const response = await fetchData<{ data: FileResponse[] }>(
					'/api/file/list',
					t('error.fetching', { resource: t('file.list') })
				);
				setFileList(response.data);
			} catch (error) {
				console.error(error);
				toast.error(t('error.fetching', { resource: t('file.list') }, 'error'));
			}
		};

		if (fileList.length === 0) {
			fetchFileList();
		}
	}, [fileList.length, setFileList, t]);

	/**
     * Handles navigation to the file details page.
     *
     * @param {string} id - The ID of the file to view.
     */
	const handleFileClick = (id: string) => {
		navigate(`/file/${id}`);
	};

	/**
     * Opens the delete confirmation modal for a specific file.
     *
     * @param {string} id - The ID of the file to delete.
     */
	const handleDeleteClick = (id: string) => {
		setSelectedFileId(id);
		setIsModalOpen(true);
	};

	/**
     * Confirms the deletion of the selected file.
     *
     * @async
     * @function confirmDelete
     */
	const confirmDelete = async() => {
		if (!selectedFileId) return;

		try {
			await api.delete(`/api/file/${selectedFileId}`);
			const updatedFileList = fileList.filter((file) => file.id !== selectedFileId);
			setFileList(updatedFileList);
			setIsModalOpen(false);
			setSelectedFileId(null);

			if (updatedFileList.length === 0) {
				toast.info(t('file.no-files'));
			} else {
				toast.success(t('file.delete-success'));
			}
		} catch (error: unknown) {
			setDeleteError(error.message);
			toast.error(t('file.delete-error'));
		}
	};

	/**
     * Closes the delete confirmation modal.
     */
	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedFileId(null);
	};

	if (fileList.length === 0) {
		return (
			<div
				className="flex items-center justify-center flex-grow bg-gray-100"
				data-testid="empty-state"
			>
				<p className="text-lg text-gray-600">{t('file.no-files')}</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-4">
			<h1 className="text-3xl font-bold text-blue-600 mb-6" data-testid="file-list-title">
				{t('file.list')}
			</h1>
			{deleteError && (
				<p data-testid="delete-error-message" className="text-red-600 mt-2">
					{deleteError}
				</p>
			)}

			<div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
				<ul className="divide-y divide-gray-200">
					{fileList.map((file) => (
						<li
							key={file.id}
							className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
							data-testid={`file-item-${file.id}`}
							onClick={() => handleFileClick(file.id)}
						>
							<div>
								<p className="text-lg font-semibold text-gray-800">{file.originalName}</p>
								<p className="text-sm text-gray-500">
									{t('file.size')}: {file.size} {t('file.bytes')}
								</p>
							</div>
							<div className="flex items-center space-x-4">
								<span
									className="text-blue-600 hover:underline"
									data-testid={`view-button-${file.id}`}
								>
									{t('file.view')}
								</span>
								<button
									className="text-red-600 hover:underline"
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteClick(file.id);
									}}
									data-testid={`delete-button-${file.id}`}
								>
									{t('file.delete')}
								</button>
							</div>
						</li>
					))}
				</ul>
			</div>

			<Modal
				show={isModalOpen}
				onClose={closeModal}
				dismissible
				size="md"
				className="!bg-black/50"
				data-testid="delete-confirmation-modal"
			>
				<ModalHeader>{t('file.confirm-delete')}</ModalHeader>
				<ModalBody>
					<p className="text-base leading-relaxed text-gray-500">
						{t('file.confirm-delete-message')}
					</p>
				</ModalBody>
				<ModalFooter>
					<Button color="failure" onClick={confirmDelete} data-testid="confirm-delete-button">
						{t('file.delete')}
					</Button>
					<Button color="gray" onClick={closeModal} data-testid="cancel-delete-button">
						{t('file.cancel')}
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default FileList;