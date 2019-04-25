import Resource from './resource';
import RoleRepresentation from '../defs/roleRepresentation';
import {KeycloakAdminClient} from '../client';

export class Roles extends Resource<{realm?: string}> {
  /**
   * Realm roles
   */

  public find = this.makeRequest<void, RoleRepresentation[]>({
    method: 'GET',
    path: '/roles',
  });

  public create = this.makeRequest<RoleRepresentation, {roleName: string}>({
    method: 'POST',
    path: '/roles',
    returnResourceIdInLocationHeader: {field: 'roleName'},
  });

  /**
   * Roles by name
   */

  public findOneByName = this.makeRequest<{name: string}, RoleRepresentation>({
    method: 'GET',
    path: '/roles/{name}',
    urlParamKeys: ['name'],
    catchNotFound: true,
  });

  public updateByName = this.makeUpdateRequest<
    {name: string},
    RoleRepresentation,
    void
  >({
    method: 'PUT',
    path: '/roles/{name}',
    urlParamKeys: ['name'],
  });

  public delByName = this.makeRequest<{name: string}, void>({
    method: 'DELETE',
    path: '/roles/{name}',
    urlParamKeys: ['name'],
  });

  /**
   * Roles by id
   */

  public findOneById = this.makeRequest<{id: string}, RoleRepresentation>({
    method: 'GET',
    path: '/roles-by-id/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public updateById = this.makeUpdateRequest<
    {id: string},
    RoleRepresentation,
    void
  >({
    method: 'PUT',
    path: '/roles-by-id/{id}',
    urlParamKeys: ['id'],
  });

  public delById = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/roles-by-id/{id}',
    urlParamKeys: ['id'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
