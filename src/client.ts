import {getToken, Credentials} from './utils/auth';
import {defaultBaseUrl, defaultRealm} from './utils/constants';
import {Users} from './resources/users';
import {Groups} from './resources/groups';
import {Roles} from './resources/roles';
import {Clients} from './resources/clients';
import {Realms} from './resources/realms';
import {IdentityProviders} from './resources/identityProviders';
import {Components} from './resources/components';
import {AxiosRequestConfig} from 'axios';

export interface ConnectionConfig {
  baseUrl?: string;
  realmName?: string;
  requestConfig?: AxiosRequestConfig;
}

export class KeycloakAdminClient {
  // Resources
  public users: Users;
  public groups: Groups;
  public roles: Roles;
  public clients: Clients;
  public realms: Realms;
  public identityProviders: IdentityProviders;
  public components: Components;

  // Members
  public baseUrl: string;
  public realmName: string;
  public accessToken: string;
  private requestConfig?: AxiosRequestConfig;

  constructor(connectionConfig?: ConnectionConfig) {
    this.baseUrl =
      (connectionConfig && connectionConfig.baseUrl) || defaultBaseUrl;
    this.realmName =
      (connectionConfig && connectionConfig.realmName) || defaultRealm;
    this.requestConfig = connectionConfig && connectionConfig.requestConfig;

    // Initialize resources
    this.users = new Users(this);
    this.groups = new Groups(this);
    this.roles = new Roles(this);
    this.clients = new Clients(this);
    this.realms = new Realms(this);
    this.identityProviders = new IdentityProviders(this);
    this.components = new Components(this);
  }

  public async auth(credentials: Credentials) {
    const {accessToken} = await getToken({
      baseUrl: this.baseUrl,
      realmName: this.realmName,
      credentials,
      requestConfig: this.requestConfig,
    });
    this.accessToken = accessToken;
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public getRequestConfig() {
    return this.requestConfig;
  }

  public setConfig(connectionConfig: ConnectionConfig) {
    if (
      typeof connectionConfig.baseUrl === 'string' &&
      connectionConfig.baseUrl
    ) {
      this.baseUrl = connectionConfig.baseUrl;
    }

    if (
      typeof connectionConfig.realmName === 'string' &&
      connectionConfig.realmName
    ) {
      this.realmName = connectionConfig.realmName;
    }
  }
}
