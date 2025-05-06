module.exports = {
	testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	modulePathIgnorePatterns: ['<rootDir>/dist/']
};