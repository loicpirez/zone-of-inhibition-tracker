import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import { env } from '../config/env';

// Ensure the log directory exists
if (!fs.existsSync(env.logsDir)) {
	fs.mkdirSync(env.logsDir, { recursive: true });
}

/**
 * Winston logger instance configured for both development and production environments.
 *
 * - In development, logs are printed in colorized format to the console.
 * - In production, logs are written to files: `error.log` (for errors only) and `combined.log` (all logs).
 *
 * The logger includes timestamps and error stack traces for better debugging.
 */
export const logger = createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true })
	),
	transports: [
		// Console transport for development
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf((info) => {
					const { level, message, stack } = info as { level: string; message: string; stack?: string };
					return `[${level}]: ${stack || message}`;
				})
			),
		}),
		// File transport for error logs
		new transports.File({
			filename: `${env.logsDir}/error.log`,
			level: 'error',
			format: format.json(),
		}),
		// File transport for all logs
		new transports.File({
			filename: `${env.logsDir}/combined.log`,
			format: format.json(),
		}),
	],
});
