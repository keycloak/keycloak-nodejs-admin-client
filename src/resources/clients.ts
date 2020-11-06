import Resource from './resource';
import ClientRepresentation from '../defs/clientRepresentation';
import {KeycloakAdminClient} from '../client';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import CredentialRepresentation from '../defs/credentialRepresentation';
import ClientScopeRepresentation from '../defs/clientScopeRepresentation';
import ProtocolMapperRepresentation from '../defs/protocolMapperRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import UserSessionRepresentation from '../defs/userSessionRepresentation';

export interface ClientQuery {
  first?: number;
  max?: number;
  clientId?: string;
  viewableOnly?: boolean;
}

export class Clients extends Resource<{realm?: string}> {
  public find = this.makeRequest<ClientQuery, ClientRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<ClientRepresentation, {id: string}>({
    method: 'POST',
    returnResourceIdInLocationHeader: {field: 'id'},
  });

  /**
   * Single client
   */

  public findOne = this.makeRequest<{id: string}, ClientRepresentation>({
    method: 'GET',
    path: '/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    {id: string},
    ClientRepresentation,
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

  /**
   * Client roles
   */

  public createRole = this.makeRequest<RoleRepresentation, {roleName: string}>({
    method: 'POST',
    path: '/{id}/roles',
    urlParamKeys: ['id'],
    returnResourceIdInLocationHeader: {field: 'roleName'},
  });

  public listRoles = this.makeRequest<{id: string}, RoleRepresentation[]>({
    method: 'GET',
    path: '/{id}/roles',
    urlParamKeys: ['id'],
  });

  public findRole = this.makeRequest<
    {id: string; roleName: string},
    RoleRepresentation
  >({
    method: 'GET',
    path: '/{id}/roles/{roleName}',
    urlParamKeys: ['id', 'roleName'],
    catchNotFound: true,
  });

  public updateRole = this.makeUpdateRequest<
    {id: string; roleName: string},
    RoleRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}/roles/{roleName}',
    urlParamKeys: ['id', 'roleName'],
  });

  public delRole = this.makeRequest<{id: string; roleName: string}, void>({
    method: 'DELETE',
    path: '/{id}/roles/{roleName}',
    urlParamKeys: ['id', 'roleName'],
  });

  public findUsersWithRole = this.makeRequest<
    {id: string; roleName: string; first?: number; max?: number},
    UserRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/roles/{roleName}/users',
    urlParamKeys: ['id', 'roleName'],
  });

  /**
   * Service account user
   */

  public getServiceAccountUser = this.makeRequest<
    {id: string},
    UserRepresentation
  >({
    method: 'GET',
    path: '/{id}/service-account-user',
    urlParamKeys: ['id'],
  });

  /**
   * Client secret
   */

  public generateNewClientSecret = this.makeRequest<{id: string}, {id: string}>(
    {
      method: 'POST',
      path: '/{id}/client-secret',
      urlParamKeys: ['id'],
    },
  );

  public getClientSecret = this.makeRequest<
    {id: string},
    CredentialRepresentation
  >({
    method: 'GET',
    path: '/{id}/client-secret',
    urlParamKeys: ['id'],
  });

  /**
   * Client Scopes
   */
  public listDefaultClientScopes = this.makeRequest<
    {id: string},
    ClientScopeRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/default-client-scopes',
    urlParamKeys: ['id'],
  });

  public addDefaultClientScope = this.makeRequest<
    {id: string; clientScopeId: string},
    void
  >({
    method: 'PUT',
    path: '/{id}/default-client-scopes/{clientScopeId}',
    urlParamKeys: ['id', 'clientScopeId'],
  });

  public delDefaultClientScope = this.makeRequest<
    {id: string; clientScopeId: string},
    void
  >({
    method: 'DELETE',
    path: '/{id}/default-client-scopes/{clientScopeId}',
    urlParamKeys: ['id', 'clientScopeId'],
  });

  public listOptionalClientScopes = this.makeRequest<
    {id: string},
    ClientScopeRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/optional-client-scopes',
    urlParamKeys: ['id'],
  });

  public addOptionalClientScope = this.makeRequest<
    {id: string; clientScopeId: string},
    void
  >({
    method: 'PUT',
    path: '/{id}/optional-client-scopes/{clientScopeId}',
    urlParamKeys: ['id', 'clientScopeId'],
  });

  public delOptionalClientScope = this.makeRequest<
    {id: string; clientScopeId: string},
    void
  >({
    method: 'DELETE',
    path: '/{id}/optional-client-scopes/{clientScopeId}',
    urlParamKeys: ['id', 'clientScopeId'],
  });

  /**
   * Protocol Mappers
   */

  public addMultipleProtocolMappers = this.makeUpdateRequest<
    {id: string},
    ProtocolMapperRepresentation[],
    void
  >({
    method: 'POST',
    path: '/{id}/protocol-mappers/add-models',
    urlParamKeys: ['id'],
  });

  public addProtocolMapper = this.makeUpdateRequest<
    {id: string},
    ProtocolMapperRepresentation,
    void
  >({
    method: 'POST',
    path: '/{id}/protocol-mappers/models',
    urlParamKeys: ['id'],
  });

  public listProtocolMappers = this.makeRequest<
    {id: string},
    ProtocolMapperRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/protocol-mappers/models',
    urlParamKeys: ['id'],
  });

  public findProtocolMapperById = this.makeRequest<
    {id: string; mapperId: string},
    ProtocolMapperRepresentation
  >({
    method: 'GET',
    path: '/{id}/protocol-mappers/models/{mapperId}',
    urlParamKeys: ['id', 'mapperId'],
    catchNotFound: true,
  });

  public findProtocolMappersByProtocol = this.makeRequest<
    {id: string; protocol: string},
    ProtocolMapperRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/protocol-mappers/protocol/{protocol}',
    urlParamKeys: ['id', 'protocol'],
    catchNotFound: true,
  });

  public updateProtocolMapper = this.makeUpdateRequest<
    {id: string; mapperId: string},
    ProtocolMapperRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}/protocol-mappers/models/{mapperId}',
    urlParamKeys: ['id', 'mapperId'],
  });

  public delProtocolMapper = this.makeRequest<
    {id: string; mapperId: string},
    void
  >({
    method: 'DELETE',
    path: '/{id}/protocol-mappers/models/{mapperId}',
    urlParamKeys: ['id', 'mapperId'],
  });

  /**
   * Scope Mappings
   */
  public listScopeMappings = this.makeRequest<
    {id: string},
    MappingsRepresentation
  >({
    method: 'GET',
    path: '/{id}/scope-mappings',
    urlParamKeys: ['id'],
  });

  public addClientScopeMappings = this.makeUpdateRequest<
    {id: string; client: string},
    RoleRepresentation[],
    void
  >({
    method: 'POST',
    path: '/{id}/scope-mappings/clients/{client}',
    urlParamKeys: ['id', 'client'],
  });

  public listClientScopeMappings = this.makeRequest<
    {id: string; client: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/scope-mappings/clients/{client}',
    urlParamKeys: ['id', 'client'],
  });

  public listAvailableClientScopeMappings = this.makeRequest<
    {id: string; client: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/scope-mappings/clients/{client}/available',
    urlParamKeys: ['id', 'client'],
  });

  public listCompositeClientScopeMappings = this.makeRequest<
    {id: string; client: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/scope-mappings/clients/{client}/available',
    urlParamKeys: ['id', 'client'],
  });

  public delClientScopeMappings = this.makeUpdateRequest<
    {id: string; client: string},
    RoleRepresentation[],
    void
  >({
    method: 'DELETE',
    path: '/{id}/scope-mappings/clients/{client}',
    urlParamKeys: ['id', 'client'],
  });

  public addRealmScopeMappings = this.makeUpdateRequest<
    {id: string},
    RoleRepresentation[],
    void
  >({
    method: 'POST',
    path: '/{id}/scope-mappings/realm',
    urlParamKeys: ['id', 'client'],
  });

  public listRealmScopeMappings = this.makeRequest<
    {id: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/scope-mappings/realm',
    urlParamKeys: ['id'],
  });

  public listAvailableRealmScopeMappings = this.makeRequest<
    {id: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/scope-mappings/realm/available',
    urlParamKeys: ['id'],
  });

  public listCompositeRealmScopeMappings = this.makeRequest<
    {id: string},
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/scope-mappings/realm/available',
    urlParamKeys: ['id'],
  });

  public delRealmScopeMappings = this.makeUpdateRequest<
    {id: string},
    RoleRepresentation[],
    void
  >({
    method: 'DELETE',
    path: '/{id}/scope-mappings/realm',
    urlParamKeys: ['id'],
  });

  /**
   * Sessions
   */
  public listSessions = this.makeRequest<
    {id: string; first?: number; max?: number},
    UserSessionRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/user-sessions',
    urlParamKeys: ['id'],
  });

  public listOfflineSessions = this.makeRequest<
    {id: string; first?: number; max?: number},
    UserSessionRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/offline-sessions',
    urlParamKeys: ['id'],
  });

  public getSessionCount = this.makeRequest<{id: string}, {count: number}>({
    method: 'GET',
    path: '/{id}/session-count',
    urlParamKeys: ['id'],
  });

  public getOfflineSessionCount = this.makeRequest<
    {id: string},
    {count: number}
  >({
    method: 'GET',
    path: '/{id}/offline-session-count',
    urlParamKeys: ['id'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/clients',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }

  /**
   * Find single protocol mapper by name.
   */
  public async findProtocolMapperByName(payload: {
    realm?: string;
    id: string;
    name: string;
  }): Promise<ProtocolMapperRepresentation> {
    const allProtocolMappers = await this.listProtocolMappers({
      id: payload.id,
      ...(payload.realm ? {realm: payload.realm} : {}),
    });
    const protocolMapper = allProtocolMappers.find(
      (mapper) => mapper.name === payload.name,
    );
    return protocolMapper ? protocolMapper : null;
  }
}
