import { getToken, Credential } from './utils/auth';
import { defaultBaseUrl, defaultRealm } from './utils/contants';
import { Users } from './resources/users';

export interface ClientArgs {
  baseUrl?: string;
  realmName?: string;
}

export class KeycloakAdminClient {
  // resources
  public users: Users;
  // members
  public baseUrl: string;
  public realmName: string;
  public accessToken: string;

  constructor(args?: ClientArgs) {
    this.baseUrl = args && args.baseUrl || defaultBaseUrl;
    this.realmName = args && args.realmName || defaultRealm;

    // initialize resources
    this.users = new Users(this);
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
