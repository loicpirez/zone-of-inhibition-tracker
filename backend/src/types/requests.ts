import { Request } from 'express';

export interface FileRequest<T = unknown> extends Request {
    file?: Express.Multer.File;
    body: T;
}