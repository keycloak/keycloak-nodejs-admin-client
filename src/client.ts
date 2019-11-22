import {getToken, Credentials} from './utils/auth';
import {defaultBaseUrl, defaultRealm} from './utils/constants';
import {Agent} from './resources/agent';
import {Users} from './resources/users';
import {Groups} from './resources/groups';
import {Roles} from './resources/roles';
import {Clients} from './resources/clients';
import {Realms} from './resources/realms';
import {ClientScopes} from './resources/clientScopes';
import {IdentityProviders} from './resources/identityProviders';
import {Components} from './resources/components';
import axios, {AxiosRequestConfig} from 'axios';

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
  public clientScopes: ClientScopes;
  public identityProviders: IdentityProviders;
  public components: Components;

  // Members
  public baseUrl: string;
  public realmName: string;
  public accessToken: string;
  public refreshToken: string;
  private requestConfig?: AxiosRequestConfig;

  constructor(connectionConfig?: ConnectionConfig, agentInjection?: Agent) {
    this.baseUrl =
      (connectionConfig && connectionConfig.baseUrl) || defaultBaseUrl;
    this.realmName =
      (connectionConfig && connectionConfig.realmName) || defaultRealm;
    this.requestConfig = connectionConfig && connectionConfig.requestConfig;

    const agent = agentInjection || new Agent(axios);

    agent.setClient(this);

    // Initialize resources
    this.users = new Users(agent);
    this.groups = new Groups(agent);
    this.roles = new Roles(agent);
    this.clients = new Clients(agent);
    this.realms = new Realms(agent);
    this.clientScopes = new ClientScopes(agent);
    this.identityProviders = new IdentityProviders(agent);
    this.components = new Components(agent);
  }

  public async auth(credentials: Credentials) {
    const {accessToken, refreshToken} = await getToken({
      baseUrl: this.baseUrl,
      realmName: this.realmName,
      credentials,
      requestConfig: this.requestConfig,
    });
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
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
