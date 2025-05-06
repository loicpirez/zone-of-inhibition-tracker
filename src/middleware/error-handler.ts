import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { ERROR_MESSAGES, ErrorMessage } from '../constants/error-messages';

/**
 * Represents a custom application-level error with HTTP status and structured error code.
 *
 * Used to throw consistent errors throughout the application with predefined codes/messages.
 *
 * @example
 * throw new AppError(404, ERROR_MESSAGES.FILE_NOT_FOUND);
 */
export class AppError extends Error {
	/** Custom error code for client-side consumption */
	public code: string;

	/**
	 * Creates a new AppError instance.
	 *
	 * @param statusCode - The HTTP status code to return (e.g. 400, 404, 500).
	 * @param error - The error message and code. Can be a function or object from ERROR_MESSAGES.
	 */
	constructor(public statusCode: number, public error: ErrorMessage) {
		const resolvedError = typeof error === 'function' ? error(0) : error;
		super(resolvedError.message);
		this.name = resolvedError.code;
		this.code = resolvedError.code;
	}
}

/**
 * Global Express error-handling middleware.
 *
 * Intercepts any thrown or forwarded errors, logs them using the application's logger,
 * and returns a formatted JSON response to the client with a status code and error object.
 *
 * @param err - The error thrown or passed to next().
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param _next - The unused next function required by Express error middleware signature.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
	if (err instanceof AppError) {
		logger.error(
			`Handled error: ${err.message} | Code: ${err.code} | Request: ${req.method} ${req.url}`
		);
		res.status(err.statusCode).json({
			error: {
				message: err.message,
				code: err.code,
			},
		});
	} else {
		logger.error(
			`Unhandled error: ${err.stack || 'Unknown error'} | Request: ${req.method} ${req.url} | Headers: ${JSON.stringify(req.headers)}`
		);
		res.status(500).json({
			error: {
				message: ERROR_MESSAGES.INTERNAL_ERROR.message,
				code: ERROR_MESSAGES.INTERNAL_ERROR.code,
			},
		});
	}
}
