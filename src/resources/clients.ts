import Resource from './resource';
import ClientRepresentation from '../defs/clientRepresentation';
import { KeycloakAdminClient } from '../client';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';

export interface ClientQuery {
  clientId?: string;
  viewableOnly?: boolean;
}

export class Clients extends Resource<{realm?: string}> {
  public find = this.makeRequest<ClientQuery, ClientRepresentation[]>({
    method: 'GET'
  });

  public create = this.makeRequest<ClientRepresentation, void>({
    method: 'POST'
  });

  /**
   * Single client
   */

  public findOne = this.makeRequest<{id: string}, ClientRepresentation>({
    method: 'GET',
    path: '/{id}',
    urlParams: ['id'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<{id: string}, ClientRepresentation, void>({
    method: 'PUT',
    path: '/{id}',
    urlParams: ['id']
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    urlParams: ['id']
  });

  /**
   * Client roles
   */

  public createRole = this.makeRequest<RoleRepresentation, void>({
    method: 'POST',
    path: '/{id}/roles',
    urlParams: ['id']
  });

  public listRoles = this.makeRequest<{id: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/roles',
    urlParams: ['id']
  });

  public findRole = this.makeRequest<{id: string, roleName: string}, RoleRepresentation>({
    method: 'GET',
    path: '/{id}/roles/{roleName}',
    urlParams: ['id', 'roleName'],
    catchNotFound: true
  });

  public updateRole = this.makeUpdateRequest<{id: string, roleName: string}, RoleRepresentation, void>({
    method: 'PUT',
    path: '/{id}/roles/{roleName}',
    urlParams: ['id', 'roleName']
  });

  public delRole = this.makeRequest<{id: string, roleName: string}, void>({
    method: 'DELETE',
    path: '/{id}/roles/{roleName}',
    urlParams: ['id', 'roleName']
  });

  public findUsersWithRole =
    this.makeRequest<{id: string, roleName: string, first?: number, max?: number}, UserRepresentation[]>({
    method: 'GET',
    path: '/{id}/roles/{roleName}/users',
    urlParams: ['id', 'roleName']
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/clients',
      urlParams: {
        realm: client.realmName
      }
    });
  }
}
