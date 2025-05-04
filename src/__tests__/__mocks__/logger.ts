const logger = {
	error: jest.fn((...args) => console.error('[MOCK ERROR]', ...args)),
	warn: jest.fn((...args) => console.warn('[MOCK WARN]', ...args)),
	info: jest.fn((...args) => console.info('[MOCK INFO]', ...args)),
	debug: jest.fn((...args) => console.debug('[MOCK DEBUG]', ...args)),
};

export default { logger };
