export class CustomError extends Error {
	public status: number;
	public data: ApiError | FileResponse | DownloadFileResponse | null;

	constructor(
		message: string,
		status: number,
		data: ApiError | FileResponse | DownloadFileResponse | null
	) {
		super(message);
		this.status = status;
		this.data = data;
		Object.setPrototypeOf(this, CustomError.prototype);
	}
}

export type ApiError = {
	error: {
		message: string;
		code: string;
	};
};

export enum FileErrorCode {
	FILE_NOT_FOUND = 'FILE_NOT_FOUND',
	NO_FILE_UPLOADED = 'NO_FILE_UPLOADED',
	INVALID_UUID = 'INVALID_UUID',
}

export type FileResponse = {
	id: string;
	originalName: string;
	size: number;
	mimeType: string;
	createdAt: string;
	diameters?: Array<{
		disk: number;
		diameterMm: number;
	}>;
};

export type DownloadFileResponse = {
	fileUrl: string;
};

export type ErrorResponse = ApiError;
