/* eslint-disable @typescript-eslint/naming-convention */

jest.mock('fs');

jest.mock('typeorm', () => ({
	Entity: jest.fn(),
	PrimaryGeneratedColumn: jest.fn(),
	Column: jest.fn(),
	DataSource: jest.fn().mockImplementation(() => ({
		initialize: jest.fn(),
		manager: {
			findOneBy: jest.fn(),
			remove: jest.fn(),
			save: jest.fn(),
			find: jest.fn(),
		},
	})),
}));

jest.mock('../../entities/file-metadata', () => ({
	FileMetadata: jest.fn(),
}));

jest.mock('../../config/data-source', () => ({
	dataSource: {
		initialize: jest.fn(),
		manager: {
			findOneBy: jest.fn(),
			remove: jest.fn(),
			save: jest.fn(),
			find: jest.fn(),
		},
	},
}));

jest.mock('../../utils/logger', () => ({
	logger: {
		info: jest.fn(),
		error: jest.fn(),
		warn: jest.fn(),
		debug: jest.fn(),
	},
}));

import fs from 'fs';
import { deleteFile, getFileMetadata, listFiles, saveFileMetadata, serveFile } from '../../services/file';
import { dataSource } from '../../config/data-source';
import { AppError } from '../../middleware/error-handler';
import { Response } from 'express';

const mockFilePath = '/tmp/uploads/test.jpg';
const mockFileId = '123';
const mockFileMetadata = {
	id: mockFileId,
	originalName: 'test.jpg',
	mimeType: 'image/jpeg',
	size: '1024',
	path: mockFilePath,
};

beforeEach(() => {
	jest.clearAllMocks();
	dataSource.initialize = jest.fn().mockResolvedValue(undefined);
	dataSource.manager.findOneBy = jest.fn();
	dataSource.manager.remove = jest.fn();
	dataSource.manager.save = jest.fn();
	dataSource.manager.find = jest.fn();
});

describe('deleteFile', () => {
	it('should delete file and remove metadata', async() => {
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);
		(fs.unlinkSync as jest.Mock).mockReturnValue(undefined);

		await expect(deleteFile(mockFileId)).resolves.toBeUndefined();
		expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
		expect(dataSource.manager.remove).toHaveBeenCalled();
	});

	it('should skip deletion if file does not exist', async() => {
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(false);

		await expect(deleteFile(mockFileId)).resolves.toBeUndefined();
		expect(fs.unlinkSync).not.toHaveBeenCalled();
		expect(dataSource.manager.remove).toHaveBeenCalled();
	});

	it('should throw 404 if metadata not found', async() => {
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(null);

		await expect(deleteFile(mockFileId)).rejects.toThrow(AppError);
		expect(dataSource.manager.remove).not.toHaveBeenCalled();
	});

	it('should rethrow errors during unlink', async() => {
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);
		(fs.unlinkSync as jest.Mock).mockImplementation(() => {
			throw new Error('Permission denied');
		});

		await expect(deleteFile(mockFileId)).rejects.toThrow('Permission denied');
	});
});

describe('saveFileMetadata', () => {
	it('should save metadata and return it', async() => {
		const file = {
			originalname: 'a.jpg',
			mimetype: 'image/jpeg',
			size: 1024,
			path: '/tmp/uploads/a.jpg',
		} as Express.Multer.File;

		const mockSaved = { ...file, id: 'abc' };
		(dataSource.manager.save as jest.Mock).mockResolvedValue(mockSaved);

		const result = await saveFileMetadata(file);
		expect(result).toEqual(mockSaved);
	});
});

describe('getFileMetadata', () => {
	it('should return metadata for existing file', async() => {
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		const result = await getFileMetadata(mockFileId);
		expect(result).toEqual(mockFileMetadata);
	});
});

describe('listFiles', () => {
	it('should return list of files', async() => {
		(dataSource.manager.find as jest.Mock).mockResolvedValue([mockFileMetadata]);
		const result = await listFiles();
		expect(result).toEqual([mockFileMetadata]);
	});
});

describe('serveFile', () => {
	it('should serve file if it exists', async() => {
		const res = {
			download: jest.fn((path, name, cb) => cb && cb(undefined)),
		} as unknown as Response;

		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);

		await expect(serveFile(mockFileId, res)).resolves.toBeUndefined();
		expect(res.download).toHaveBeenCalledWith(
			mockFilePath,
			mockFileMetadata.originalName,
			expect.any(Function)
		);
	});

	it('should throw if metadata is missing', async() => {
		const res = {} as Response;
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(null);
		await expect(serveFile(mockFileId, res)).rejects.toThrow(AppError);
	});

	it('should throw if file is missing from disk', async() => {
		const res = {} as Response;
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(false);
		await expect(serveFile(mockFileId, res)).rejects.toThrow(AppError);
	});

	it('should throw if download callback returns error', async() => {
		const res = {
			download: jest.fn((path, name, cb) => cb && cb(new Error('fail'))),
		} as unknown as Response;

		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);

		await expect(serveFile(mockFileId, res)).rejects.toThrow(AppError);
	});

	it('should throw if res.download callback receives an error', async() => {
		const mockRes = {
			download: jest.fn((_path, _name, cb) => cb(new Error('stream error')))
		} as unknown as Response;
	
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);
	
		await expect(serveFile(mockFileId, mockRes)).rejects.toThrow('Failed to serve file');
	});

	
	it('should handle unknown error type in deleteFile', async() => {
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);
		(fs.unlinkSync as jest.Mock).mockImplementation(() => {
			throw 'non-error string';
		});
	
		await expect(deleteFile(mockFileId)).rejects.toEqual('non-error string');
	});
	

	it('should handle error thrown synchronously in res.download', async() => {
		const res = {
			download: jest.fn(() => {
				throw new Error('download failed');
			}),
		} as unknown as Response;
	
		(dataSource.manager.findOneBy as jest.Mock).mockResolvedValue(mockFileMetadata);
		(fs.existsSync as jest.Mock).mockReturnValue(true);
	
		await expect(serveFile(mockFileId, res)).rejects.toThrow(AppError);
		expect(res.download).toHaveBeenCalled();
	});
	
});
