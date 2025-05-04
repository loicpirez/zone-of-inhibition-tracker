import { FileMetadata } from '../entities/file-metadata';
import { FileMetadataDTO } from '../types/file-metadata.dto';

export function toFileMetadataDTO(fileMetadata: FileMetadata): FileMetadataDTO {
	return {
		id: fileMetadata.id,
		originalName: fileMetadata.originalName,
		mimeType: fileMetadata.mimeType,
		size: fileMetadata.size,
		createdAt: fileMetadata.createdAt,
	};
}