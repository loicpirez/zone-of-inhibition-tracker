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

const fileRouter = Router();

fileRouter.post('/', upload.single('file'), async(req, res, next) => {
	try {
		if (!req.file) {
			throw new AppError(400, ERROR_MESSAGES.NO_FILE_UPLOADED);
		}

		validateFile(req.file);
		const metadata = await saveFileMetadata(req.file);
		res.json({ message: SUCCESS_MESSAGES.FILE_UPLOADED, file: toFileMetadataDTO(metadata) });
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

fileRouter.get('/:id', async(req: Request, res: Response, next: NextFunction) => {
	try {
		fileIdSchema.parse(req.params.id);

		const fileMetadata = await getFileMetadata(req.params.id);

		if (!fileMetadata) {
			logger.warn(`File not found: ${req.params.id}`);
			throw new AppError(404, ERROR_MESSAGES.FILE_NOT_FOUND);
		}

		res.json({ data: { file: toFileMetadataDTO(fileMetadata) } });
	} catch (error) {
		next(error);
	}
});

fileRouter.get('/download/:id', async(req: Request, res: Response, next: NextFunction) => {
	try {
		await serveFile(req.params.id, res);
	} catch (error) {
		next(error);
	}
});

fileRouter.delete('/:id', async(req, res, next) => {
	try {
		fileIdSchema.parse(req.params.id);
		await deleteFile(req.params.id);
		res.status(204).send();
	} catch (error) {
		next(error);
	}
});

export default fileRouter;