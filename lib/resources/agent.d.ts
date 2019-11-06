import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { KeycloakAdminClient } from '../client';
export interface RequestArgs {
    method: string;
    basePath?: string;
    path?: string;
    urlParamKeys?: string[];
    queryParamKeys?: string[];
    keyTransform?: Record<string, string>;
    catchNotFound?: boolean;
    payloadKey?: string;
    returnResourceIdInLocationHeader?: {
        field: string;
    };
}
export declare class Agent {
    private client;
    private getBaseParams?;
    private getBaseUrl?;
    private axios;
    constructor({ getUrlParams, getBaseUrl, axios, }: {
        getUrlParams?: (client: KeycloakAdminClient) => Record<string, any>;
        getBaseUrl?: (client: KeycloakAdminClient) => string;
        axios: AxiosInstance;
    });
    setClient(client: KeycloakAdminClient): void;
    getRequestConfig(): AxiosRequestConfig;
    request({ method, basePath, path, urlParamKeys, queryParamKeys, catchNotFound, keyTransform, payloadKey, returnResourceIdInLocationHeader, }: RequestArgs): (payload?: any) => Promise<any>;
    updateRequest({ method, basePath, path, urlParamKeys, queryParamKeys, catchNotFound, keyTransform, payloadKey, returnResourceIdInLocationHeader, }: RequestArgs): (query?: any, payload?: any) => Promise<any>;
    private requestWithParams;
    private transformKey;
}
