import { FileMetadata } from '../entities/file-metadata';
import { FileMetadataDTO } from '../types/file-metadata.dto';

/**
 * Converts a FileMetadata entity to a FileMetadataDTO.
 *
 * This is used to format the internal database model into a DTO (Data Transfer Object)
 * that can be safely returned to the client without exposing sensitive/internal data.
 *
 * @param fileMetadata - The file metadata entity from the database.
 * @returns A FileMetadataDTO object for API responses.
 */
export function toFileMetadataDTO(fileMetadata: FileMetadata): FileMetadataDTO {
	return {
		id: fileMetadata.id,
		originalName: fileMetadata.originalName,
		mimeType: fileMetadata.mimeType,
		size: fileMetadata.size,
		createdAt: fileMetadata.createdAt,
	};
}
