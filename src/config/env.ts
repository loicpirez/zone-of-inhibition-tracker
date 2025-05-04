import dotenv from 'dotenv';
import { Environment } from '../types/environment';
import { envSchema } from '../schemas/environment';

dotenv.config();


const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	const formattedErrors = JSON.stringify(parsedEnv.error.format(), null, 2);
	console.error(`Invalid environment variables: ${formattedErrors}`);
	process.exit(1);
}

export const env: Environment = {
	port: parsedEnv.data.PORT,
	uploadDir: parsedEnv.data.UPLOAD_DIR,
	logsDir: parsedEnv.data.LOGS_DIR,
	dataDir: parsedEnv.data.DATA_DIR,
};