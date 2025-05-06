const logger = {
	error: jest.fn((...args) => console.debug('[MOCK ERROR]', ...args)),
	warn: jest.fn((...args) => console.debug('[MOCK WARN]', ...args)),
	info: jest.fn((...args) => console.debug('[MOCK INFO]', ...args)),
	debug: jest.fn((...args) => console.debug('[MOCK DEBUG]', ...args)),
};

export default { logger };
