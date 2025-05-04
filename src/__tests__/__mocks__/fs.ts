/* eslint-disable @typescript-eslint/naming-convention */
const fileSystem = new Map<string, boolean>();

const mockFS = {
	...jest.requireActual('fs'),
	existsSync: jest.fn((path: string) => fileSystem.has(path) && fileSystem.get(path) === true),
	unlinkSync: jest.fn((path: string) => {
		if (!fileSystem.has(path) || fileSystem.get(path) === false) {
			throw new Error('File not found');
		}
		fileSystem.set(path, false);
	}),
	__setMockFile: (path: string) => {
		fileSystem.set(path, true);
	},
	__clearMockFiles: () => {
		fileSystem.clear();
	},
};

export default mockFS;