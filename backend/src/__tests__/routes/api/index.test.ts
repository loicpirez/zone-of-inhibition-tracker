import request from 'supertest';
import app from '../../../server';
import { API_MESSAGES } from '../../../constants/api-messages';

describe('Root API Route', () => {
	it('should return welcome message on GET /api', async() => {
		const response = await request(app).get('/api');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: API_MESSAGES.WELCOME });
	});
});
