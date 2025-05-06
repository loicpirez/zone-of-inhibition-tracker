import { useFileDetails, useFileDownload } from '../api/queries';

export type HookReturnType = ReturnType<typeof useFileDetails> | ReturnType<typeof useFileDownload>;
