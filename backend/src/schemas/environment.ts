import z from 'zod';
import path from 'path';

export const envSchema = z
	.object({
		PORT: z.string().regex(/^\d+$/, 'PORT must be a number').transform(Number).default('3001'),
		UPLOAD_DIR: z.string().default(path.resolve(__dirname, '../../uploads')),
		LOGS_DIR: z.string().default(path.resolve(__dirname, '../../logs')),
		DATA_DIR: z.string().default(path.resolve(__dirname, '../../data')),
	});