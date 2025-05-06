import { ZOITQueryResult } from './query';

export type ZOITOption = {
	key: string;
	label: string;
	hook: (_token?: string) => ZOITQueryResult;
};

export type ZOITHooks = Record<string, ZOITQueryResult>;
