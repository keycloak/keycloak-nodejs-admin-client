import { getToken, Credential } from './utils/auth';
import { defaultBaseUrl, defaultRealm } from './utils/contants';

export interface ClientArgs {
  baseUrl?: string;
  realmName?: string;
}

export class KeycloakAdminClient {
  private baseUrl: string;
  private realmName: string;
  private accessToken: string;

  constructor(args: ClientArgs) {
    this.baseUrl = args.baseUrl || defaultBaseUrl;
    this.realmName = args.realmName || defaultRealm;
  }

  public async auth(credential: Credential) {
    const {accessToken} = await getToken({
      credential
    });
    this.accessToken = accessToken;
  }
}
