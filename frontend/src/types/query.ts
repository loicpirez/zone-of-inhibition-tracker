import { UseQueryResult } from '@tanstack/react-query';
import { ApiError, DownloadFileResponse, FileResponse } from './api';

export type ZOITQueryResult = UseQueryResult<FileResponse | DownloadFileResponse, ApiError>;
