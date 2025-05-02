import dotenv from 'dotenv';
import { z } from 'zod';
import { EnvConfig } from '../types/env-config';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number').transform(Number),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;

export const ENV: EnvConfig = {
  PORT: env.PORT,
};

export function getEnv(key: keyof EnvConfig, fallback: string): string {
  return process.env[key] ?? fallback;
}

export function getEnvInt(key: keyof EnvConfig, fallback: number): number {
  const val = process.env[key];
  const parsed = val ? parseInt(val, 10) : NaN;
  return isNaN(parsed) ? fallback : parsed;
}