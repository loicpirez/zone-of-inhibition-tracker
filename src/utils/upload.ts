import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import { ALLOWED_FILE_FORMATS, FileType, MAX_FILE_SIZE } from '../constants/file';
import { env } from '../config/env';
import { logger } from './logger';

if (!fs.existsSync(env.uploadDir)) {
	fs.mkdirSync(env.uploadDir, { recursive: true });
}

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