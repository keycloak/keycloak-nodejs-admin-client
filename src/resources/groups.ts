import {KeycloakAdminClient} from '../client';
import GroupRepresentation from '../defs/groupRepresentation';
import {ManagementPermissionReference} from '../defs/managementPermissionReference';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, {RoleMappingPayload} from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import Resource from './resource';

export interface GroupQuery {
  first?: number;
  max?: number;
  search?: string;
  briefRepresentation?: boolean;
}

export interface GroupCountQuery {
  search?: string;
  top?: boolean;
}

export class Groups extends Resource<{realm?: string}> {
  public find = this.makeRequest<GroupQuery, GroupRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<GroupRepresentation, {id: string}>({
    method: 'POST',
    returnResourceIdInLocationHeader: {field: 'id'},
  });

  /**
   * Single user
   */

  public findOne = this.makeRequest<{id: string}, GroupRepresentation>({
    method: 'GET',
    path: '/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    {id: string},
    GroupRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}',
    urlParamKeys: ['id'],
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    urlParamKeys: ['id'],
  });


  public count = this.makeRequest<GroupCountQuery, {count: number}>({
    method: 'GET',
    path: '/count',
  });

  /**
   * Set or create child.
   * This will just set the parent if it exists. Create it and set the parent if the group doesn’t exist.
   */

  public setOrCreateChild = this.makeUpdateRequest<
    {id: string},
    GroupRepresentation,
    {id: string}
  >({
    method: 'POST',
    path: '/{id}/children',
    urlParamKeys: ['id'],
    returnResourceIdInLocationHeader: {field: 'id'},
  });

  /**
   * Members
   */

  public listMembers = this.makeRequest<
    {id: string; first?: number; max?: number},
    UserRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/members',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  /**
   * Role mappings
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_role_mapper_resource
   */

  public listRoleMappings = this.makeRequest<
    {id: string},
    MappingsRepresentation
  >({
    method: 'GET',
    path: '/{id}/role-mappings',
    urlParamKeys: ['id'],
  });

  public addRealmRoleMappings = this.makeRequest<
    {id: string; roles: RoleMappingPayload[]},
    void
  >({
    method: 'POST',
    path: '/{id}/role-mappings/realm',
    urlParamKeys: ['id'],
    payloadKey: 'roles',
  });

  public listRealmRoleMappings = this.makeRequest<
    {id: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/role-mappings/realm',
    urlParamKeys: ['id'],
  });

  public delRealmRoleMappings = this.makeRequest<
    {id: string; roles: RoleMappingPayload[]},
    void
  >({
    method: 'DELETE',
    path: '/{id}/role-mappings/realm',
    urlParamKeys: ['id'],
    payloadKey: 'roles',
  });

  public listAvailableRealmRoleMappings = this.makeRequest<
    {id: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/role-mappings/realm/available',
    urlParamKeys: ['id'],
  });

  /**
   * Client role mappings
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_client_role_mappings_resource
   */

  public listClientRoleMappings = this.makeRequest<
    {id: string; clientUniqueId: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParamKeys: ['id', 'clientUniqueId'],
  });

  public addClientRoleMappings = this.makeRequest<
    {id: string; clientUniqueId: string; roles: RoleMappingPayload[]},
    void
  >({
    method: 'POST',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParamKeys: ['id', 'clientUniqueId'],
    payloadKey: 'roles',
  });

  public delClientRoleMappings = this.makeRequest<
    {id: string; clientUniqueId: string; roles: RoleMappingPayload[]},
    void
  >({
    method: 'DELETE',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParamKeys: ['id', 'clientUniqueId'],
    payloadKey: 'roles',
  });

  public listAvailableClientRoleMappings = this.makeRequest<
    {id: string; clientUniqueId: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/role-mappings/clients/{clientUniqueId}/available',
    urlParamKeys: ['id', 'clientUniqueId'],
  });

  /**
   * Authorization permissions
   */
  public updatePermission = this.makeUpdateRequest<
    {id: string},
    ManagementPermissionReference,
    ManagementPermissionReference
  >({
    method: 'PUT',
    path: '/{id}/management/permissions',
    urlParamKeys: ['id'],
  });

  public listPermissions = this.makeRequest<
    {id: string},
    ManagementPermissionReference
  >({
    method: 'GET',
    path: '/{id}/management/permissions',
    urlParamKeys: ['id'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/groups',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
