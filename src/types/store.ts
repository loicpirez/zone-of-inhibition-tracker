import { FileResponse } from './api';

export interface AppState {
	fileId: string | null;
	error: { message: string; code: string } | null;
	addFileToList: (file: FileResponse) => void;
	setFileId: (_id: string | null) => void;
	setFileList: (_fileList: FileResponse[]) => void;
	resetFileId: () => void;
	setError: (_error: { message: string; code: string } | null) => void;
	resetError: () => void;
}
