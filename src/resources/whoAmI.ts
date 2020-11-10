import WhoAmIRepresentation from '../defs/whoAmIRepresentation';
import KeycloakAdminClient from '..';
import Resource from './resource';

export class WhoAmI extends Resource<{realm?: string}> {
  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/{realm}/console',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }

  public find = this.makeRequest<{}, WhoAmIRepresentation>({
    method: 'GET',
    path: '/whoami',
  });
}
