import { z } from 'zod';
import { ALLOWED_FILE_FORMATS, FileType, MAX_FILE_SIZE } from '../constants/file';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { AppError } from '../middleware/error-handler';
import { logger } from './logger';

/**
 * Zod schema to validate uploaded file metadata.
 * Ensures the file type is allowed and the file size is within the defined limit.
 */
export const fileSchema = z.object({
	originalname: z.string(),
	mimetype: z.string().refine((type) => ALLOWED_FILE_FORMATS.includes(type as FileType), {
		message: ERROR_MESSAGES.INVALID_FILE_TYPE.message,
	}),
	size: z.number().max(MAX_FILE_SIZE, {
		message: ERROR_MESSAGES.FILE_TOO_LARGE(MAX_FILE_SIZE).message,
	}),
	path: z.string(),
});

/**
 * Type definition inferred from the Zod file schema.
 */
export type FileMetadata = z.infer<typeof fileSchema>;

/**
 * Validates a file object against the defined schema.
 *
 * @param {Express.Multer.File} file - The uploaded file object.
 * @throws {AppError} - Throws an AppError with status 400 if validation fails.
 */
export function validateFile(file: Express.Multer.File): void {
	try {
		fileSchema.parse(file);
	} catch (error) {
		logger.error('File validation error:', error);
		throw new AppError(400, {
			message: error instanceof Error ? error.message : 'Invalid file',
			code: 'INVALID_FILE',
		});
	}
}
