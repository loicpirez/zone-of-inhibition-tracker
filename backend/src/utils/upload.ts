import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import { ALLOWED_FILE_FORMATS, FileType, MAX_FILE_SIZE } from '../constants/file';
import { env } from '../config/env';
import { logger } from './logger';

/**
 * Ensures the upload directory exists by creating it recursively if needed.
 */
if (!fs.existsSync(env.uploadDir)) {
	fs.mkdirSync(env.uploadDir, { recursive: true });
}

/**
 * Multer configuration for file uploads.
 * 
 * - Files are stored in a temporary directory defined by `env.uploadDir`.
 * - File size is limited by `MAX_FILE_SIZE`.
 * - Only files with MIME types listed in `ALLOWED_FILE_FORMATS` are accepted.
 * - Invalid files trigger an error and are rejected.
 */
const upload = multer({
	dest: env.uploadDir,
	limits: { fileSize: MAX_FILE_SIZE },
	fileFilter: (_, file, callback: FileFilterCallback) => {
		if (!ALLOWED_FILE_FORMATS.includes(file.mimetype as FileType)) {
			logger.error('Invalid file type:', file.mimetype);
			return callback(new Error('Invalid file type'));
		}
		callback(null, true);
	},
});

export { upload };
