import { NextFunction, Request, Response, Router } from 'express';
import { upload } from '../../utils/upload';
import { deleteFile, getFileMetadata, listFiles, saveFileMetadata, serveFile } from '../../services/file';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error-handler';
import { fileIdSchema } from '../../schemas/file';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { SUCCESS_MESSAGES } from '../../constants/success-messages';
import { validateFile } from '../../utils/file';
import { toFileMetadataDTO } from '../../utils/mapper';
import { getDiameters } from '../../utils/diameters';

const fileRouter = Router();

/**
 * POST /api/file
 *
 * Uploads a file and stores its metadata and associated zone of inhibition diameters.
 *
 * @route POST /api/file
 * @access Public
 * @returns {200} Success response with file metadata and diameters
 * @returns {400} Error response if no file or invalid file
 */
fileRouter.post('/', upload.single('file'), async (req, res, next) => {
	try {
		if (!req.file) {
			throw new AppError(400, ERROR_MESSAGES.NO_FILE_UPLOADED);
		}

		validateFile(req.file);
		const metadata = await saveFileMetadata(req.file);
		const diameters = getDiameters(req.file.originalname);

		res.json({
			message: SUCCESS_MESSAGES.FILE_UPLOADED,
			file: { ...toFileMetadataDTO(metadata), diameters },
		});
	} catch (error) {
		next(error);
	}
});

/**
 * GET /api/file/
 *
 * Lists all uploaded files with their metadata and diameters.
 *
 * @route GET /api/file/
 * @access Public
 * @returns {200} List of files with metadata and diameters
 * @returns {500} Internal server error
 */
fileRouter.get('/', async (_req, res, next) => {
	try {
		const files = await listFiles();
		const fileDTOs = files.map((file) => ({
			...toFileMetadataDTO(file),
			diameters: getDiameters(file.originalName) || [], // Ensure diameters is an empty array if not found
		}));
		res.json({ data: fileDTOs });
	} catch (error) {
		next(error);
	}
});

/**
 * GET /api/file/:id
 *
 * Retrieves metadata and diameters for a file by its ID.
 *
 * @route GET /api/file/:id
 * @access Public
 * @param {string} id - UUID of the file
 * @returns {200} File metadata and diameters
 * @returns {400} Invalid UUID format
 * @returns {404} File not found
 */
fileRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		fileIdSchema.parse(req.params.id);

		const fileMetadata = await getFileMetadata(req.params.id);
		if (!fileMetadata) {
			logger.warn(`File not found: ${req.params.id}`);
			throw new AppError(404, ERROR_MESSAGES.FILE_NOT_FOUND);
		}

		const diameters = getDiameters(fileMetadata.originalName);

		res.json({
			data: {
				file: { ...toFileMetadataDTO(fileMetadata), diameters },
			},
		});
	} catch (error) {
		next(error);
	}
});

/**
 * GET /api/file/download/:id
 *
 * Downloads the raw file by its ID.
 *
 * @route GET /api/file/download/:id
 * @access Public
 * @param {string} id - UUID of the file
 * @returns {200} File stream as attachment
 * @returns {404} File not found
 */
fileRouter.get('/download/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await serveFile(req.params.id, res);
	} catch (error) {
		next(error);
	}
});

/**
 * DELETE /api/file/:id
 *
 * Deletes a file from the database and disk by its ID.
 *
 * @route DELETE /api/file/:id
 * @access Public
 * @param {string} id - UUID of the file
 * @returns {204} No content if deleted
 * @returns {400} Invalid UUID format
 * @returns {404} File not found
 */
fileRouter.delete('/:id', async (req, res, next) => {
	try {
		fileIdSchema.parse(req.params.id);
		await deleteFile(req.params.id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default fileRouter;
