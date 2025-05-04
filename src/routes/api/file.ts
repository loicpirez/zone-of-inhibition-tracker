import { Request, Response, Router } from 'express';
import { upload } from '../../utils/upload';
import { deleteFile, getFileMetadata, listFiles, saveFileMetadata, serveFile } from '../../services/file';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/error-handler';
import { fileIdSchema } from '../../schemas/file';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { SUCCESS_MESSAGES } from '../../constants/success-messages';
import { validateFile } from '../../utils/file';
import { toFileMetadataDTO } from '../../utils/mapper';

const fileRouter = Router();

fileRouter.post('/', upload.single('file'), async(req, res, next) => {
	try {
		if (!req.file) {
			throw new AppError(400, ERROR_MESSAGES.NO_FILE_UPLOADED);
		}

		validateFile(req.file);
		const metadata = await saveFileMetadata(req.file);
		res.json({ message: SUCCESS_MESSAGES.FILE_UPLOADED, file: metadata });
	} catch (error) {
		next(error);
	}
});

fileRouter.get('/list', async(_req, res, next) => {
	try {
		const files = await listFiles();
		const fileDTOs = files.map(toFileMetadataDTO);
		res.json({ data: fileDTOs });
	} catch (error) {
		next(error);
	}
});



fileRouter.get('/:id', async(req: Request, res: Response): Promise<void> => {
	try {
		fileIdSchema.parse(req.params.id);

		const fileMetadata = await getFileMetadata(req.params.id);


		if (!fileMetadata) {
			logger.warn(`File not found: ${req.params.id}`);
			res.status(404).json({ error: ERROR_MESSAGES.FILE_NOT_FOUND });
			return;
		}

		res.json({ data: { file: toFileMetadataDTO(fileMetadata) } });
	} catch (error) {
		logger.error(`Error retrieving file metadata for ID ${req.params.id}:`, error);
		res.status(500).json({ error: ERROR_MESSAGES.FAILED_TO_GET_METADATA });
	}
});

fileRouter.get('/download/:id', async(req: Request, res: Response) => {
	try {
		await serveFile(req.params.id, res);
	} catch (error) {
		logger.error('Error serving file:', error);
		res.status(500).json({ error: ERROR_MESSAGES.FAILED_TO_SERVE_FILE });
	}
});

fileRouter.delete('/:id', async(req, res, next) => {
	try {
		await deleteFile(req.params.id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default fileRouter;