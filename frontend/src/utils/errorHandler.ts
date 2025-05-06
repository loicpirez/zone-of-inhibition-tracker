import { FileErrorCode } from '../types/api';

export const getUserFriendlyError = (code: string, t: (key: string, opts?: any) => string) => {
    switch (code) {
        case FileErrorCode.FILE_NOT_FOUND:
            return t('error.file-not-found');
        case FileErrorCode.INVALID_UUID:
            return t('error.invalid-uuid');
        case FileErrorCode.NO_FILE_UPLOADED:
            return t('error.no-file-uploaded');
        default:
            return t('error.unexpected');
    }
};
