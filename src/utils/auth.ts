import axios, { AxiosRequestConfig } from 'axios';
import camelize from 'camelize';
import querystring from 'querystring';
import { defaultBaseUrl, defaultRealm } from './constants';

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
  requestConfigs?: AxiosRequestConfig;
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

export const getToken = async (settings: Settings): Promise<TokenResponse> => {
  // url construction
  const baseUrl = settings.baseUrl || defaultBaseUrl;
  const realmName = settings.realmName || defaultRealm;
  const url = `${baseUrl}/realms/${realmName}/protocol/openid-connect/token`;

  // Prepare credentials for openid-connect token request
  // ref: http://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
  const credentials = settings.credentials || ({} as any);
  const payload = querystring.stringify({
    username: credentials.username,
    password: credentials.password,
    grant_type: credentials.grantType,
    client_id: credentials.clientId
  });
  const configs: AxiosRequestConfig = {
    ...settings.requestConfigs
  };

  if (credentials.clientSecret) {
    configs.auth = {
      username: credentials.clientId,
      password: credentials.clientSecret
    };
  }
  const {data} = await axios.post(url, payload, configs);
  return camelize(data);
};
