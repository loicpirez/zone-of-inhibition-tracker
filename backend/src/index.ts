import 'reflect-metadata';
import { dataSource } from './config/data-source';
import app from './server';
import { env } from './config/env';
import { logger } from './utils/logger';
import { AppError } from './middleware/error-handler';
import { ERROR_MESSAGES } from './constants/error-messages';
import { loadDiametersMap } from './utils/diameters';

loadDiametersMap(`${env.dataDir}/diameters.csv`)
	.then(() => {
		logger.info('Diameters data loaded successfully');
	})
	.catch((error) => {
		logger.error('Failed to load diameters data:', error);
		process.exit(1);
	});

dataSource.initialize()
	.then(() => {
		logger.info('Database connected successfully');
		app.listen(env.port, () => {
			logger.info(`Zone of Inhibition Tracker is running at http://localhost:${env.port}`);
		});
	})
	.catch((error) => {
		logger.error('Error during initialization:', error);
		throw new AppError(500, ERROR_MESSAGES.DB_ERROR);
	});