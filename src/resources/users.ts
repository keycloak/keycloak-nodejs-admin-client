import Resource from './resource';
import UserRepresentation from '../defs/userRepresentation';
import { KeycloakAdminClient } from '../client';

export interface UserQuery {
  email?: string;
  first?: number;
  firstName?: string;
  lastName?: string;
  max?: number;
  search?: string;
  username?: string;
}

export class Users extends Resource {
  public getUsers = this.makeRequest<UserQuery, UserRepresentation[]>({
    method: 'GET'
  });

  public createUser = this.makeRequest<UserRepresentation, void>({
    method: 'POST'
  });

  /**
   * Single user
   */

  public getUser = this.makeRequest<{id: string}, UserRepresentation>({
    method: 'GET',
    path: '/{id}',
    params: ['id'],
    catchNotFound: true
  });

  public updateUser = this.makeRequest<UserRepresentation, void>({
    method: 'PUT',
    path: '/{id}',
    params: ['id']
  });

  public deleteUser = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    params: ['id']
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
