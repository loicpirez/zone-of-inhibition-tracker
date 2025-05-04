
export const ERROR_MESSAGES = {
	DB_ERROR: { message: 'Database connection failed', code: 'DB_ERROR' },
	FAILED_TO_GET_METADATA: { message: 'Failed to retrieve file metadata', code: 'FAILED_TO_GET_METADATA' },
	FAILED_TO_SERVE_FILE: { message: 'Failed to serve file', code: 'FAILED_TO_SERVE_FILE' },
	FILE_NOT_FOUND: { message: 'File not found', code: 'FILE_NOT_FOUND' },
	FILE_TOO_LARGE: (size: number) => ({ message: `File size exceeds the maximum limit of ${size} bytes`, code: 'FILE_TOO_LARGE' }),
	INTERNAL_ERROR: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
	INVALID_FILE_TYPE: { message: 'Only image files are allowed', code: 'INVALID_FILE_TYPE' },
	INVALID_FILE: { message: 'Invalid file', code: 'INVALID_FILE' },
	INVALID_UUID: { message: 'Invalid UUID format', code: 'INVALID_UUID' },
	NO_FILE_UPLOADED: { message: 'No file uploaded', code: 'NO_FILE_UPLOADED' },
} as const;

export type StaticErrorMessage = { message: string; code: string };
export type DynamicErrorMessage = (...args: [number]) => { message: string; code: string };

export type ErrorMessage = StaticErrorMessage | DynamicErrorMessage;