import { NextFunction, Request, Response } from 'express';
import { Readable } from 'stream';

const upload = {
	single: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
		const allowedMimeTypes = ['image/jpeg', 'image/png'];
		const mockFileName = req.headers['x-mock-filename'] as string;

		if (!mockFileName) {
			return res.status(400).json({ error: { message: 'No file uploaded' } });
		}

		const mimeType = mockFileName.endsWith('.jpg')
			? 'image/jpeg'
			: mockFileName.endsWith('.png')
				? 'image/png'
				: null;

		if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
			return res.status(400).json({ error: { message: 'Only image files are allowed' } });
		}

		req.file = {
			fieldname: 'file',
			originalname: mockFileName,
			encoding: '7bit',
			mimetype: mimeType,
			size: 1024,
			destination: '/tmp/uploads',
			filename: mockFileName,
			path: `/tmp/uploads/${mockFileName}`,
			buffer: Buffer.from('test'),
			stream: Readable.from(Buffer.from('test')),
		};
		next();
	}),
};

export default upload;