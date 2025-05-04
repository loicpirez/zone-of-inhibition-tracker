import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import { env } from '../config/env';

if (!fs.existsSync(env.logsDir)) {
	fs.mkdirSync(env.logsDir, { recursive: true });
}

export const logger = createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: format.combine(
		format.timestamp(),
		format.errors({ stack: true })
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf((info) => {
					const { level, message, stack } = info as { level: string; message: string; stack?: string };
					return `[${level}]: ${stack || message}`;
				})
			),
		}),
		new transports.File({
			filename: `${env.logsDir}/error.log`,
			level: 'error',
			format: format.json(),
		}),
		new transports.File({
			filename: `${env.logsDir}/combined.log`,
			format: format.json(),
		}),
	],
});