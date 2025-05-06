export interface AppState {
	fileId: string | null;
	error: { message: string; code: string } | null;
	setFileId: (_id: string | null) => void;
	resetFileId: () => void;
	setError: (_error: { message: string; code: string } | null) => void;
	resetError: () => void;
}
