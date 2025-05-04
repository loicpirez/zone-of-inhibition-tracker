import { dataSource } from '../config/data-source';
import { FileMetadata } from '../entities/file-metadata';
import { Response } from 'express';
import fs from 'fs';
import { AppError } from '../middleware/error-handler';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { logger } from '../utils/logger';

export async function saveFileMetadata(file: Express.Multer.File): Promise<FileMetadata> {
	const fileMetadata = new FileMetadata();

	fileMetadata.originalName = file.originalname;
	fileMetadata.mimeType = file.mimetype;
	fileMetadata.size = file.size.toString();
	fileMetadata.path = file.path;

	return await dataSource.manager.save(fileMetadata);
}

export async function getFileMetadata(id: string): Promise<FileMetadata | null> {
	return await dataSource.manager.findOneBy(FileMetadata, { id });
}

export async function serveFile(id: string, res: Response): Promise<void> {
	logger.info(`Serving file with ID: ${id}`);
	const fileMetadata = await getFileMetadata(id);

	if (!fileMetadata || !fs.existsSync(fileMetadata.path)) {
		logger.info(`File not found: ${id}`);
		throw new AppError(404, ERROR_MESSAGES.FILE_NOT_FOUND);
	}

	try {
		logger.info(`File path: ${fileMetadata.path}`);
		res.download(fileMetadata.path, fileMetadata.originalName, (err) => {
			if (err) {
				logger.error(`Error during file download: ${err.message}`);
				throw new AppError(500, ERROR_MESSAGES.FAILED_TO_SERVE_FILE);
			}
		});
	} catch (error) {
		if (error instanceof Error) {
			logger.info(`Unhandled error during file download: ${error.message}`);
		} else {
			logger.info('Unhandled error during file download: Unknown error');
		}
		throw new AppError(500, ERROR_MESSAGES.FAILED_TO_SERVE_FILE);
	}
}

export async function listFiles(): Promise<FileMetadata[]> {
	return await dataSource.manager.find(FileMetadata);
}

export async function deleteFile(id: string): Promise<void> {
	logger.info(`Attempting to delete file with ID: ${id}`);
	const fileMetadata = await dataSource.manager.findOneBy(FileMetadata, { id });

	if (!fileMetadata) {
		logger.info(`File metadata not found for ID: ${id}`);
		throw new AppError(404, ERROR_MESSAGES.FILE_NOT_FOUND);
	}

	try {
		logger.info(`File metadata found: ${JSON.stringify(fileMetadata)}`);
		if (fs.existsSync(fileMetadata.path)) {
			logger.info(`File exists on disk: ${fileMetadata.path}`);
			fs.unlinkSync(fileMetadata.path);
			logger.info(`File deleted successfully: ${fileMetadata.path}`);
		} else {
			logger.error(`File not found on disk: ${fileMetadata.path}`);
		}

		await dataSource.manager.remove(FileMetadata, fileMetadata);
		logger.info(`File metadata removed from database for ID: ${id}`);
	} catch (error) {
		if (error instanceof Error) {
			logger.error(`Error deleting file: ${error.message}`);
		} else {
			logger.error('Error deleting file: Unknown error');
		}
		throw error;
	}
	
}