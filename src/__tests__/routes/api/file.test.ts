import mockFS from '../../__mocks__/fs';
jest.mock('fs', () => mockFS);

import mockLogger from '../../__mocks__/logger';
jest.mock('../../../utils/logger', () => mockLogger);

import mockUpload from '../../__mocks__/upload';
jest.mock('../../../utils/upload', () => ({ upload: mockUpload }));

import mockFileService from '../../__mocks__/file-service';
jest.mock('../../../services/file', () => ({
	...jest.requireActual('../../../services/file'),
	serveFile: mockFileService.serveFile,
}));

import request from 'supertest';
import app from '../../../server';
import { dataSource } from '../../../config/data-source';
import { FileMetadata } from '../../../entities/file-metadata';
import { setDiametersMap } from '../../../utils/diameters';

const MOCK_FILE_ID = '00000000-0000-0000-0000-000000000000';

beforeAll(async() => {
	if (!dataSource.isInitialized) {
		await dataSource.initialize();
	}

	setDiametersMap(
		new Map([
			['file1.jpg', [{ disk: 1, diameterMm: 10 }, { disk: 2, diameterMm: 15 }]],
			['file2.png', [{ disk: 1, diameterMm: 20 }, { disk: 2, diameterMm: 25 }]],
		]),
	);
});
afterAll(async() => {
	if (dataSource.isInitialized) {
		await dataSource.destroy();
	}
	jest.clearAllMocks();
});

describe('File API Routes', () => {
	beforeEach(async() => {
		mockFS.clearMockFiles();
		jest.clearAllMocks();
	
		if (!dataSource.isInitialized) {
			await dataSource.initialize();
		}
		await dataSource.getRepository(FileMetadata).clear();
	});

	describe('POST /api/file', () => {
		it('should upload a file and save metadata with diameters', async() => {
			const response = await request(app)
				.post('/api/file')
				.set('x-mock-filename', 'file1.jpg')
				.attach('file', Buffer.from('test'), 'file1.jpg');

			console.log('pb response', response.body);
		
			expect(response.status).toBe(200);
			expect(response.body.file).toMatchObject({
				originalName: 'file1.jpg',
				mimeType: 'image/jpeg',
				diameters: [
					{ disk: 1, diameterMm: 10 },
					{ disk: 2, diameterMm: 15 },
				],
			});
		});
		it('should return 400 if no file is uploaded', async() => {
			const response = await request(app).post('/api/file');
			expect(response.status).toBe(400);
			expect(response.body.error.message).toBe('No file uploaded');
		});

		it('should return 400 if file validation fails', async() => {
			const response = await request(app)
				.post('/api/file')
				.set('x-mock-filename', 'invalid-file.txt')
				.attach('file', Buffer.from('test'), 'invalid-file.txt');

			expect(response.status).toBe(400);
			expect(response.body.error.message).toBe('Only image files are allowed');
		});
	});

	describe('GET /api/file/list', () => {
		it('should list all uploaded files with diameters', async() => {
			const fileRepo = dataSource.getRepository(FileMetadata);
			await fileRepo.save([
				{ originalName: 'file1.jpg', mimeType: 'image/jpeg', size: '1024', path: '/tmp/uploads/file1.jpg' },
				{ originalName: 'file2.png', mimeType: 'image/png', size: '2048', path: '/tmp/uploads/file2.png' },
			]);

			const response = await request(app).get('/api/file/list');

			expect(response.status).toBe(200);
			expect(response.body.data).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						originalName: 'file1.jpg',
						diameters: [
							{ disk: 1, diameterMm: 10 },
							{ disk: 2, diameterMm: 15 },
						],
					}),
					expect.objectContaining({
						originalName: 'file2.png',
						diameters: [
							{ disk: 1, diameterMm: 20 },
							{ disk: 2, diameterMm: 25 },
						],
					}),
				]),
			);
		});

		it('should return an empty list if no files are uploaded', async() => {
			const response = await request(app).get('/api/file/list');
			expect(response.status).toBe(200);
			expect(response.body.data).toEqual([]);
		});
	});

	describe('GET /api/file/:id', () => {
		it('should retrieve file metadata by ID with diameters', async() => {
			const fileRepo = dataSource.getRepository(FileMetadata);
			const file = await fileRepo.save({
				originalName: 'file1.jpg',
				mimeType: 'image/jpeg',
				size: '1024',
				path: '/tmp/uploads/file1.jpg',
			});

			const response = await request(app).get(`/api/file/${file.id}`);

			expect(response.status).toBe(200);
			expect(response.body.data.file).toMatchObject({
				id: file.id,
				originalName: 'file1.jpg',
				diameters: [
					{ disk: 1, diameterMm: 10 },
					{ disk: 2, diameterMm: 15 },
				],
			});
		});

		it('should return 404 if file is not found', async() => {
			const response = await request(app).get(`/api/file/${MOCK_FILE_ID}`);
			expect(response.status).toBe(404);
			expect(response.body.error.message).toBe('File not found');
		});
	});

	describe('GET /api/file/download/:id', () => {
		it('should download a file by ID', async() => {
			const fileRepo = dataSource.getRepository(FileMetadata);
			const file = await fileRepo.save({
				originalName: 'file1.jpg',
				mimeType: 'image/jpeg',
				size: '1024',
				path: '/tmp/uploads/file1.jpg',
			});

			const response = await request(app).get(`/api/file/download/${file.id}`);
			expect(response.status).toBe(200);
			expect(response.header['content-disposition']).toContain('attachment');
		});

		it('should return 404 if file is not found', async() => {
			const response = await request(app).get(`/api/file/download/${MOCK_FILE_ID}`);
			expect(response.status).toBe(404);
			expect(response.body.error.message).toBe('File not found');
		});
	});

	describe('DELETE /api/file/:id', () => {
		it('should delete a file by ID', async() => {
			mockFS.setMockFile('/tmp/uploads/file1.jpg', 'mock content');

			const fileRepo = dataSource.getRepository(FileMetadata);
			const file = await fileRepo.save({
				originalName: 'file1.jpg',
				mimeType: 'image/jpeg',
				size: '1024',
				path: '/tmp/uploads/file1.jpg',
			});

			const response = await request(app).delete(`/api/file/${file.id}`);
			expect(response.status).toBe(204);
			expect(mockFS.unlinkSync).toHaveBeenCalledWith('/tmp/uploads/file1.jpg');
		});

		it('should return 404 if file is not found', async() => {
			const response = await request(app).delete(`/api/file/${MOCK_FILE_ID}`);
			expect(response.status).toBe(404);
			expect(response.body.error.message).toBe('File not found');
		});

		it('should return 500 if fs.unlinkSync throws error', async() => {
			mockFS.setMockFile('/tmp/uploads/file1.jpg', 'mock content');
			mockFS.unlinkSync.mockImplementationOnce(() => {
				throw new Error('Permission denied');
			});

			const fileRepo = dataSource.getRepository(FileMetadata);
			const file = await fileRepo.save({
				originalName: 'file1.jpg',
				mimeType: 'image/jpeg',
				size: '1024',
				path: '/tmp/uploads/file1.jpg',
			});

			const response = await request(app).delete(`/api/file/${file.id}`);
			expect(response.status).toBe(500);
			expect(response.body.error.code).toBe('INTERNAL_ERROR');
		});
	});
});