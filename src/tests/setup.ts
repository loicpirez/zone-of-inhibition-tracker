import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { server } from '../mocks/server';

process.env.VITE_ZOIT_API_URL = 'http://localhost:3000';

beforeAll(() => server.listen());

afterEach(() => {
	server.resetHandlers();
	cleanup();
});

afterAll(() => server.close());
