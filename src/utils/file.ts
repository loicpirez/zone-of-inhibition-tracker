import { z } from 'zod';
import { ALLOWED_FILE_FORMATS, FileType, MAX_FILE_SIZE } from '../constants/file';
import { ERROR_MESSAGES } from '../constants/error-messages';
import { AppError } from '../middleware/error-handler';
import { logger } from './logger';

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

export type FileMetadata = z.infer<typeof fileSchema>;

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