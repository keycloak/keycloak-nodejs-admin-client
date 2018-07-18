import Resource from './resource';
import UserRepresentation from '../defs/userRepresentation';
import { KeycloakAdminClient } from '../client';

export class Users extends Resource {
  public getUsers = this.makeRequest<UserRepresentation[]>({
    method: 'GET'
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/users',
      params: {
        realm: client.realmName
      }
    });
  }
}
