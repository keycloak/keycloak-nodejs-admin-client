import {getToken, Credentials} from './utils/auth';
import {defaultBaseUrl, defaultRealm} from './utils/constants';
import {Cache} from './resources/cache';
import {Users} from './resources/users';
import {UserStorage} from './resources/userStorage';
import {Groups} from './resources/groups';
import {Roles} from './resources/roles';
import {Clients} from './resources/clients';
import {Realms} from './resources/realms';
import {ClientScopes} from './resources/clientScopes';
import {ClientPolicies} from './resources/clientPolicies';
import {IdentityProviders} from './resources/identityProviders';
import {Components} from './resources/components';
import {AuthenticationManagement} from './resources/authenticationManagement';
import {ServerInfo} from './resources/serverInfo';
import {WhoAmI} from './resources/whoAmI';
import {AttackDetection} from './resources/attackDetection';
import {AxiosRequestConfig} from 'axios';

import {Sessions} from './resources/sessions';
import {UserStorageProvider} from './resources/userStorageProvider';
import { Credentials as Credential } from './resources/credentials';
import type {KeycloakInstance, KeycloakInitOptions, KeycloakConfig} from 'keycloak-js';
import {RequestArgs} from './resources/agent';

export interface ConnectionConfig {
  baseUrl?: string;
  realmName?: string;
  requestConfig?: AxiosRequestConfig;
  requestArgOptions?: Pick<RequestArgs, 'catchNotFound'>;
}

export class KeycloakAdminClient {
  // Resources
  public users: Users;
  public userStorageProvider: UserStorageProvider;
  public userStorage: UserStorage;
  public groups: Groups;
  public roles: Roles;
  public clients: Clients;
  public credentials: Credential;
  public realms: Realms;
  public clientScopes: ClientScopes;
  public clientPolicies: ClientPolicies;
  public identityProviders: IdentityProviders;
  public components: Components;
  public serverInfo: ServerInfo;
  public whoAmI: WhoAmI;
  public attackDetection: AttackDetection;
  public sessions: Sessions;
  public authenticationManagement: AuthenticationManagement;
  public cache: Cache;

  // Members
  public baseUrl: string;
  public realmName: string;
  public accessToken?: string;
  public refreshToken?: string;
  public keycloak?: KeycloakInstance;

  private requestConfig?: AxiosRequestConfig;
  private globalRequestArgOptions?: Pick<RequestArgs, 'catchNotFound'>;

  constructor(connectionConfig?: ConnectionConfig) {
    this.baseUrl =
      (connectionConfig && connectionConfig.baseUrl) || defaultBaseUrl;
    this.realmName =
      (connectionConfig && connectionConfig.realmName) || defaultRealm;
    this.requestConfig = connectionConfig && connectionConfig.requestConfig;
    this.globalRequestArgOptions = connectionConfig && connectionConfig.requestArgOptions;

    // Initialize resources
    this.users = new Users(this);
    this.userStorageProvider = new UserStorageProvider(this);
    this.userStorage = new UserStorage(this);
    this.groups = new Groups(this);
    this.roles = new Roles(this);
    this.clients = new Clients(this);
    this.credentials = new Credential(this);
    this.realms = new Realms(this);
    this.clientScopes = new ClientScopes(this);
    this.clientPolicies = new ClientPolicies(this);
    this.identityProviders = new IdentityProviders(this);
    this.components = new Components(this);
    this.authenticationManagement = new AuthenticationManagement(this);
    this.serverInfo = new ServerInfo(this);
    this.whoAmI = new WhoAmI(this);
    this.sessions = new Sessions(this);
    this.attackDetection = new AttackDetection(this);
    this.cache = new Cache(this);
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

  public async init(init?: KeycloakInitOptions, config?: KeycloakConfig) {
    if (typeof window === 'undefined') {
      return;
    }

    const Keycloak = (await import('keycloak-js')).default;
    this.keycloak = Keycloak(config);

    if (init) {
      await this.keycloak.init(init);
    }

    if (this.keycloak.authServerUrl) {
      this.baseUrl = this.keycloak.authServerUrl;
    }
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  public async getAccessToken() {
    if (this.keycloak) {
      try {
        await this.keycloak.updateToken(5);
      } catch (error) {
        this.keycloak.login();
      }
      return this.keycloak.token;
    }
    return this.accessToken;
  }

  public getRequestConfig() {
    return this.requestConfig;
  }

  public getGlobalRequestArgOptions(): Pick<RequestArgs, 'catchNotFound'> | undefined {
    return this.globalRequestArgOptions;
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
    this.requestConfig = connectionConfig.requestConfig;
  }
}
