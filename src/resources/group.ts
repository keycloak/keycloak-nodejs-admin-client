import Resource from './resource';
import GroupRepresentation from '../defs/groupRepresentation';
import { KeycloakAdminClient } from '../client';
import UserRepresentation from '../defs/userRepresentation';

export interface GroupQuery {
  first?: number;
  max?: number;
  search?: string;
}

export class Groups extends Resource {
  public find = this.makeRequest<GroupQuery, GroupRepresentation[]>({
    method: 'GET'
  });

  public create = this.makeRequest<GroupRepresentation, void>({
    method: 'POST'
  });

  /**
   * Single user
   */

  public findOne = this.makeRequest<{id: string}, GroupRepresentation>({
    method: 'GET',
    path: '/{id}',
    params: ['id'],
    catchNotFound: true
  });

  public update = this.makeRequest<GroupRepresentation, void>({
    method: 'PUT',
    path: '/{id}',
    params: ['id']
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    params: ['id']
  });

  /**
   * Members
   */

  public listMembers = this.makeRequest<{id: string, first?: number, max?: number}, UserRepresentation[]>({
    method: 'GET',
    path: '/{id}/members',
    params: ['id'],
    catchNotFound: true
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/groups',
      params: {
        realm: client.realmName
      }
    });
  }
}
