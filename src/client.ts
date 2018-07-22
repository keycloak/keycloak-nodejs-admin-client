import { getToken, Credential } from './utils/auth';
import { defaultBaseUrl, defaultRealm } from './utils/contants';
import { Users } from './resources/users';
import { Groups } from './resources/groups';
import { Roles } from './resources/roles';
import { Clients } from './resources/clients';
import { Realms } from './resources/realms';

export interface ClientArgs {
  baseUrl?: string;
  realmName?: string;
}

export class KeycloakAdminClient {
  // resources
  public users: Users;
  public groups: Groups;
  public roles: Roles;
  public clients: Clients;
  public realms: Realms;

  // members
  public baseUrl: string;
  public realmName: string;
  public accessToken: string;

  constructor(args?: ClientArgs) {
    this.baseUrl = args && args.baseUrl || defaultBaseUrl;
    this.realmName = args && args.realmName || defaultRealm;

    // initialize resources
    this.users = new Users(this);
    this.groups = new Groups(this);
    this.roles = new Roles(this);
    this.clients = new Clients(this);
    this.realms = new Realms(this);
  }

  public async auth(credential: Credential) {
    const {accessToken} = await getToken({
      credential
    });
    this.accessToken = accessToken;
  }

  public getAccessToken() {
    return this.accessToken;
  }
}
