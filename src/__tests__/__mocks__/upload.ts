import { NextFunction, Request, Response } from 'express';
import { Readable } from 'stream';

const upload = {
	single: jest.fn(() => (req: Request, res: Response, next: NextFunction) => {
		if (!req.headers['content-type']?.startsWith('multipart/form-data')) {
			return res.status(400).json({ error: { message: 'No file uploaded' } });
		}
		req.file = {
			fieldname: 'file',
			originalname: 'test-file.jpg',
			encoding: '7bit',
			mimetype: 'image/jpeg',
			size: 1024,
			destination: '/tmp/uploads',
			filename: 'test-file.jpg',
			path: '/tmp/uploads/test-file.jpg',
			stream: new Readable(),
			buffer: Buffer.from(''),
		};
		next();
	}),
};

export default upload;