import Resource from './resource';
import {ServerInfoRepresentation} from '../defs/serverInfoRepesentation';
import KeycloakAdminClient from '..';

export class ServerInfo extends Resource {
  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/serverinfo',
      getBaseUrl: () => client.baseUrl,
    });
  }

  public find = this.makeRequest<{}, ServerInfoRepresentation>({
    method: 'GET',
    path: '/',
  });
}
