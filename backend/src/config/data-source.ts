import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FileMetadata } from '../entities/file-metadata';
import { env } from './env';

export const dataSource = new DataSource({
	type: 'sqlite',
	database: `${env.dataDir}/database.sqlite`,
	entities: [FileMetadata],
	synchronize: true,
	logging: false,
});