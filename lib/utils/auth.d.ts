import { AxiosRequestConfig } from 'axios';
export interface Credentials {
    username: string;
    password: string;
    grantType: string;
    clientId: string;
    clientSecret?: string;
}
export interface Settings {
    realmName?: string;
    baseUrl?: string;
    credentials: Credentials;
    requestConfig?: AxiosRequestConfig;
}
export interface TokenResponse {
    accessToken: string;
    expiresIn: string;
    refreshExpiresIn: number;
    refreshToken: string;
    tokenType: string;
    notBeforePolicy: number;
    sessionState: string;
    scope: string;
}
export declare const getToken: (settings: Settings) => Promise<TokenResponse>;
