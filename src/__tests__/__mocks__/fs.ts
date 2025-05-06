import { Readable } from 'stream';

const fileSystem = new Map<string, string>();

const mockFS = {
	...jest.requireActual('fs'),
	existsSync: jest.fn((path: string) => fileSystem.has(path)),
	unlinkSync: jest.fn((path: string) => {
		if (!fileSystem.has(path)) {
			throw new Error('File not found');
		}
		fileSystem.delete(path);
	}),
	createReadStream: jest.fn((path: string) => {
		if (!fileSystem.has(path)) {
			throw new Error('File not found');
		}
		const content = fileSystem.get(path);
		if (content === undefined) {
			throw new Error('File content is undefined');
		}
		return Readable.from([content]);
	}),
	setMockFile: (path: string, content: string) => {
		fileSystem.set(path, content);
	},
	clearMockFiles: () => {
		fileSystem.clear();
	},
};

export default mockFS;