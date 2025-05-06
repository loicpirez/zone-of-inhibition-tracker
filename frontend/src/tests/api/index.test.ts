import api from '../../api/index';

describe('api', () => {
	it('should create an axios instance with the correct baseURL', () => {
		expect(api.defaults.baseURL).toBe(import.meta.env.VITE_ZOIT_API_URL);
	});

	it('should set the correct headers', () => {
		expect(api.defaults.headers['Content-Type']).toBe('application/json');
	});
});
