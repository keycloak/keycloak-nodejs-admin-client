import Resource from './resource';
import GroupRepresentation from '../defs/groupRepresentation';
import { KeycloakAdminClient } from '../client';
import UserRepresentation from '../defs/userRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, {RoleMappingPayload} from '../defs/roleRepresentation';

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
    urlParams: ['id'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<{id: string}, GroupRepresentation, void>({
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
   * Members
   */

  public listMembers = this.makeRequest<{id: string, first?: number, max?: number}, UserRepresentation[]>({
    method: 'GET',
    path: '/{id}/members',
    urlParams: ['id'],
    catchNotFound: true
  });

  /**
   * Role mappings
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_role_mapper_resource
   */

  public listRoleMappings = this.makeRequest<{id: string}, MappingsRepresentation>({
    method: 'GET',
    path: '/{id}/role-mappings',
    urlParams: ['id']
  });

  public addRealmRoleMappings = this.makeRequest<{id: string, roles: RoleMappingPayload[]}, void>({
    method: 'POST',
    path: '/{id}/role-mappings/realm',
    urlParams: ['id'],
    payloadKey: 'roles'
  });

  public listRealmRoleMappings = this.makeRequest<{id: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/realm',
    urlParams: ['id']
  });

  public delRealmRoleMappings = this.makeRequest<{id: string, roles: RoleMappingPayload[]}, void>({
    method: 'DELETE',
    path: '/{id}/role-mappings/realm',
    urlParams: ['id'],
    payloadKey: 'roles'
  });

  public listAvailableRealmRoleMappings = this.makeRequest<{id: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/realm/available',
    urlParams: ['id']
  });

  /**
   * Client role mappings
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_client_role_mappings_resource
   */

  public listClientRoleMappings = this.makeRequest<{id: string, clientUniqueId: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParams: ['id', 'clientUniqueId']
  });

  public addClientRoleMappings =
    this.makeRequest<{id: string, clientUniqueId: string, roles: RoleMappingPayload[]}, void>({
    method: 'POST',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParams: ['id', 'clientUniqueId'],
    payloadKey: 'roles'
  });

  public delClientRoleMappings =
    this.makeRequest<{id: string, clientUniqueId: string, roles: RoleMappingPayload[]}, void>({
    method: 'DELETE',
    path: '/{id}/role-mappings/clients/{clientUniqueId}',
    urlParams: ['id', 'clientUniqueId'],
    payloadKey: 'roles'
  });

  public listAvailableClientRoleMappings =
    this.makeRequest<{id: string, clientUniqueId: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/role-mappings/clients/{clientUniqueId}/available',
    urlParams: ['id', 'clientUniqueId']
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/groups',
      urlParams: {
        realm: client.realmName
      }
    });
  }
}
