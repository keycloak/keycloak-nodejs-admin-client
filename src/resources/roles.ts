import Resource from './resource';
import RoleRepresentation from '../defs/roleRepresentation';
import { KeycloakAdminClient } from '../client';

export class Roles extends Resource {
  /**
   * Realm roles
   */

  public find = this.makeRequest<void, RoleRepresentation[]>({
    method: 'GET',
    path: '/roles'
  });

  public create = this.makeRequest<RoleRepresentation, void>({
    method: 'POST',
    path: '/roles'
  });

  /**
   * Roles by name
   */

  public findOneByName = this.makeRequest<{name: string}, RoleRepresentation>({
    method: 'GET',
    path: '/roles/{name}',
    params: ['name'],
    catchNotFound: true
  });

  public updateByName = this.makeUpdateRequest<{name: string}, RoleRepresentation, void>({
    method: 'PUT',
    path: '/roles/{name}',
    params: ['name']
  });

  public delByName = this.makeRequest<{name: string}, void>({
    method: 'DELETE',
    path: '/roles/{name}',
    params: ['name']
  });

  /**
   * Roles by id
   */

  public findOneById = this.makeRequest<{id: string}, RoleRepresentation>({
    method: 'GET',
    path: '/roles-by-id/{id}',
    params: ['id'],
    catchNotFound: true
  });

  public updateById = this.makeUpdateRequest<{id: string}, RoleRepresentation, void>({
    method: 'PUT',
    path: '/roles-by-id/{id}',
    params: ['id']
  });

  public delById = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/roles-by-id/{id}',
    params: ['id']
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}',
      params: {
        realm: client.realmName
      }
    });
  }
}
