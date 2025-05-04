import { Response, Router } from 'express';
import fileRouter from './file';
import { API_MESSAGES } from '../../constants/api-messages';

const apiRouter = Router();

apiRouter.get('/', (_, res: Response) => {
	res.json({ message: API_MESSAGES.WELCOME });
});

apiRouter.use('/file', fileRouter);

export default apiRouter;