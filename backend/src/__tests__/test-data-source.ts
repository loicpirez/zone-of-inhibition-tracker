import { DataSource } from 'typeorm';
import { FileMetadata } from '../entities/file-metadata';

export const testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [FileMetadata],
    synchronize: true,
});
