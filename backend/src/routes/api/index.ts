import { Response, Router } from 'express';
import fileRouter from './file';
import { API_MESSAGES } from '../../constants/api-messages';

const apiRouter = Router();

/**
 * GET /api
 *
 * Base route of the API. Returns a welcome message.
 *
 * @route GET /api
 * @access Public
 * @returns {200} JSON with welcome message
 */
apiRouter.get('/', (_, res: Response) => {
	res.json({ message: API_MESSAGES.WELCOME });
});

/**
 * Mounts file-related routes under /api/file
 *
 * @route /api/file
 */
apiRouter.use('/file', fileRouter);

export default apiRouter;
