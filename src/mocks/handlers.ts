import { HttpHandler, HttpResponse, http } from 'msw';
import responseFileDetails from './data/response_file_details.json';
import responseApiRoot from './data/response_api_root.json';
import { Endpoint } from '../types/mocks';

const apiBaseUrl = import.meta.env.VITE_ZOIT_API_URL;

const endpoints: Record<Endpoint, { data: object; protected: boolean }> = {
	root: { data: {}, protected: false },
	file: { data: {}, protected: false },
};

const createHandler = (
	endpoint: Endpoint,
	{ data, protected: isProtected }: { data: object; protected: boolean }
): HttpHandler => {
	return http.get(`${apiBaseUrl}/${endpoint}`, async({ request }) => {
		if (isProtected) {
			const authHeader = request.headers.get('Authorization');
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}
		}
		return HttpResponse.json(data);
	});
};

const fileHandlers: HttpHandler[] = [
	http.post(`${apiBaseUrl}/api/file`, async({ request }) => {
		const formData = await request.formData();
		const file = formData.get('file');

		if (!file) {
			return HttpResponse.json(
				{
					error: {
						message: 'No file uploaded',
						code: 'NO_FILE_UPLOADED',
					},
				},
				{ status: 400 }
			);
		}

		return HttpResponse.json(
			{
				message: 'File uploaded successfully',
				file: {
					id: 'file-id',
					originalName: 'uploaded-file.png',
					mimeType: 'image/png',
					size: 12345,
					createdAt: new Date().toISOString(),
				},
			},
			{ status: 200 }
		);
	}),

	http.get(`${apiBaseUrl}/api/file/:id`, async({ params }) => {
		const { id } = params;

		if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
			return HttpResponse.json(
				{
					error: {
						message: 'Invalid UUID format',
						code: 'INVALID_UUID',
					},
				},
				{ status: 400 }
			);
		}

		if (id === 'file-id') {
			return HttpResponse.json(responseFileDetails, { status: 200 });
		}

		return HttpResponse.json(
			{
				error: {
					message: 'File not found',
					code: 'FILE_NOT_FOUND',
				},
			},
			{ status: 404 }
		);
	}),

	http.get(`${apiBaseUrl}/api/file/download/:id`, async({ params }) => {
		const { id } = params;

		if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
			return HttpResponse.json(
				{
					error: {
						message: 'Invalid UUID format',
						code: 'INVALID_UUID',
					},
				},
				{ status: 400 }
			);
		}

		if (id === 'file-id') {
			const imageBuffer = await fetch('/path/to/mock-image.png').then((res) => res.arrayBuffer());

			return new Response(imageBuffer, {
				status: 200,
				headers: {
					'Content-Type': 'image/png',
					'Content-Disposition': 'attachment; filename="mock-image.png"',
				},
			});
		}

		return HttpResponse.json(
			{
				error: {
					message: 'File not found',
					code: 'FILE_NOT_FOUND',
				},
			},
			{ status: 404 }
		);
	}),
	http.delete(`${apiBaseUrl}/api/file/:id`, async({ params }) => {
		const { id } = params;

		if (!id || !/^[a-zA-Z0-9-]+$/.test(id)) {
			return HttpResponse.json(
				{
					error: {
						message: 'Invalid UUID format',
						code: 'INVALID_UUID',
					},
				},
				{ status: 400 }
			);
		}

		if (id === 'file-id') {
			return HttpResponse.json({ message: 'File deleted successfully' }, { status: 200 });
		}

		return HttpResponse.json(
			{
				error: {
					message: 'File not found',
					code: 'FILE_NOT_FOUND',
				},
			},
			{ status: 404 }
		);
	}),

	http.get(`${apiBaseUrl}/api`, async() => {
		return HttpResponse.json(responseApiRoot, { status: 200 });
	}),
];

export const handlers: HttpHandler[] = [
	...Object.entries(endpoints).map(([key, value]) => createHandler(key as Endpoint, value)),
	...fileHandlers,
];
