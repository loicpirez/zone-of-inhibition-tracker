import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ERROR_MESSAGES, ErrorMessage } from '../constants/error-messages';

export class AppError extends Error {
	public code: string;

	constructor(public statusCode: number, public error: ErrorMessage) {
		const resolvedError = typeof error === 'function' ? error(0) : error;
		super(resolvedError.message);
		this.name = resolvedError.code;
		this.code = resolvedError.code;
	}
}

// `next` variable is not used in this function, but it's required for the implementation of error handling middleware in Express.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
	if (err instanceof AppError) {
		logger.warn(`Handled error: ${err.message} | Code: ${err.code} | Request: ${req.method} ${req.url}`);
		res.status(err.statusCode).json({
			error: {
				message: err.message,
				code: err.code,
			},
		});
	} else {
		logger.error(`Unhandled error: ${err.stack || 'Unknown error'} | Request: ${req.method} ${req.url} | Headers: ${JSON.stringify(req.headers)}`);
		res.status(500).json({
			error: {
				message: ERROR_MESSAGES.INTERNAL_ERROR.message,
				code: ERROR_MESSAGES.INTERNAL_ERROR.code,
			},
		});
	}
}