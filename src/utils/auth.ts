import axios, { AxiosRequestConfig } from 'axios';
import camelize from 'camelize';
import querystring from 'querystring';
import { defaultBaseUrl, defaultRealm } from './constants';

export interface Credential {
  username: string;
  password: string;
  grantType: string;
  clientId: string;
  clientSecret?: string;
}

export interface Settings {
  realmName?: string;
  baseUrl?: string;
  // credential
  credential: Credential;
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

  // prepare credential for openid-connect token request
  // ref: http://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
  const credential = settings.credential || {} as any;
  const payload = querystring.stringify({
    username: credential.username,
    password: credential.password,
    grant_type: credential.grantType,
    client_id: credential.clientId
  });
  const configs: AxiosRequestConfig = {
    ...settings.requestConfigs
  };

  if (credential.clientSecret) {
    configs.auth = {
      username: credential.clientId,
      password: credential.clientSecret
    };
  }
  const {data} = await axios.post(url, payload, configs);
  return camelize(data);
};
