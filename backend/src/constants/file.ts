export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export enum FileType {
	IMAGE_JPEG = 'image/jpeg',
	IMAGE_PNG = 'image/png',
	IMAGE_GIF = 'image/gif',
}

export const ALLOWED_FILE_FORMATS = Object.values(FileType);