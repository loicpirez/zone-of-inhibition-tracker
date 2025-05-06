import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { AppError, errorHandler } from './middleware/error-handler';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
	next(new AppError(404, { message: 'Route not found', code: 'ROUTE_NOT_FOUND' }));
});

app.use(errorHandler);

export default app;