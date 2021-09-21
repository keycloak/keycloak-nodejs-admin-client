import {KeycloakAdminClient} from '../client';
import ClientRepresentation from '../defs/clientRepresentation';
import ClientScopeRepresentation from '../defs/clientScopeRepresentation';
import CredentialRepresentation from '../defs/credentialRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import PolicyRepresentation from '../defs/policyRepresentation';
import ResourceRepresentation from '../defs/resourceRepresentation';
import ProtocolMapperRepresentation from '../defs/protocolMapperRepresentation';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import UserSessionRepresentation from '../defs/userSessionRepresentation';
import ResourceEvaluation from '../defs/resourceEvaluation';
import GlobalRequestResult from '../defs/globalRequestResult';
import Resource from './resource';
import CertificateRepresentation from '../defs/certificateRepresentation';
import KeyStoreConfig from '../defs/keystoreConfig';

export interface ClientQuery {
  first?: number;
  max?: number;
  clientId?: string;
  viewableOnly?: boolean;
}

export interface PolicyQuery {
  id?: string;
  name?: string;
  type?: string;
  resource?: string;
  scope?: string;
  permission?: string;
  owner?: string;
  fields?: string;
  first?: number;
  max?: number;
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

  public generateNewClientSecret = this.makeRequest<
    {id: string},
    CredentialRepresentation
  >({
    method: 'POST',
    path: '/{id}/client-secret',
    urlParamKeys: ['id'],
  });

  public generateRegistrationAccessToken = this.makeRequest<
    {id: string},
    {registrationAccessToken: string}
  >({
    method: 'POST',
    path: '/{id}/registration-access-token',
    urlParamKeys: ['id'],
  });

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

  public evaluatePermission = this.makeRequest<
    {
      id: string;
      roleContainer: string;
      type: 'granted' | 'not-granted';
      scope: string;
    },
    RoleRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/evaluate-scopes/scope-mappings/{roleContainer}/{type}',
    urlParamKeys: ['id', 'roleContainer', 'type'],
    queryParamKeys: ['scope'],
  });

  public evaluateListProtocolMapper = this.makeRequest<
    {
      id: string;
      scope: string;
    },
    ProtocolMapperRepresentation[]
  >({
    method: 'GET',
    path: '/{id}/evaluate-scopes/protocol-mappers',
    urlParamKeys: ['id'],
    queryParamKeys: ['scope'],
  });

  public evaluateGenerateAccessToken = this.makeRequest<
    {id: string; scope: string; userId: string},
    object
  >({
    method: 'GET',
    path: '/{id}/evaluate-scopes/generate-example-access-token',
    urlParamKeys: ['id'],
    queryParamKeys: ['scope', 'userId'],
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

  /**
   * Resource
   */
  public listResources = this.makeRequest<
    {id: string},
    ResourceRepresentation[]
  >({
    method: 'GET',
    path: '{id}/authz/resource-server/resource',
    urlParamKeys: ['id'],
  });

  public createResource = this.makeUpdateRequest<
    {id: string},
    ResourceRepresentation,
    ResourceRepresentation
  >({
    method: 'POST',
    path: '{id}/authz/resource-server/resource',
    urlParamKeys: ['id'],
  });

  public updateResource = this.makeUpdateRequest<
    {id: string; resourceId: string},
    ResourceRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}/authz/resource-server/resource/{resourceId}',
    urlParamKeys: ['id', 'resourceId'],
  });

  public delResource = this.makeRequest<{id: string; resourceId: string}, void>(
    {
      method: 'DELETE',
      path: '/{id}/authz/resource-server/resource/{resourceId}',
      urlParamKeys: ['id', 'resourceId'],
    },
  );

  public evaluateResource = this.makeUpdateRequest<
    {id: string},
    ResourceEvaluation
  >({
    method: 'POST',
    path: '{id}/authz/resource-server/policy/evaluate',
    urlParamKeys: ['id'],
  });

  /**
   * Policy
   */
  public listPolicies = this.makeRequest<PolicyQuery, PolicyRepresentation[]>({
    method: 'GET',
    path: '{id}/authz/resource-server/policy',
    urlParamKeys: ['id'],
  });

  public findPolicyByName = this.makeRequest<
    {id: string; name: string},
    PolicyRepresentation
  >({
    method: 'GET',
    path: '{id}/authz/resource-server/policy/search',
    urlParamKeys: ['id'],
  });

  public updatePolicy = this.makeUpdateRequest<
    {id: string; type: string; policyId: string},
    PolicyRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}/authz/resource-server/policy/{type}/{policyId}',
    urlParamKeys: ['id', 'type', 'policyId'],
  });

  public createPolicy = this.makeUpdateRequest<
    {id: string; type: string},
    PolicyRepresentation,
    PolicyRepresentation
  >({
    method: 'POST',
    path: '/{id}/authz/resource-server/policy/{type}',
    urlParamKeys: ['id', 'type'],
  });

  public findOnePolicy = this.makeRequest<
    {id: string; type: string; policyId: string},
    void
  >({
    method: 'GET',
    path: '/{id}/authz/resource-server/policy/{type}/{policyId}',
    urlParamKeys: ['id', 'type', 'policyId'],
    catchNotFound: true,
  });

  public delPolicy = this.makeRequest<{id: string; policyId: string}, void>({
    method: 'DELETE',
    path: '{id}/authz/resource-server/policy/{policyId}',
    urlParamKeys: ['id', 'policyId'],
  });

  public async createOrUpdatePolicy(payload: {
    id: string;
    policyName: string;
    policy: PolicyRepresentation;
  }): Promise<PolicyRepresentation> {
    const policyFound = await this.findPolicyByName({
      id: payload.id,
      name: payload.policyName,
    });
    if (policyFound) {
      await this.updatePolicy(
        {id: payload.id, policyId: policyFound.id, type: payload.policy.type},
        payload.policy,
      );
      return this.findPolicyByName({id: payload.id, name: payload.policyName});
    } else {
      return this.createPolicy(
        {id: payload.id, type: payload.policy.type},
        payload.policy,
      );
    }
  }

  /**
   * Scopes
   */
  public listAllScopes = this.makeRequest<
    {id: string},
    {id: string; name: string}[]
  >({
    method: 'GET',
    path: '/{id}/authz/resource-server/scope',
    urlParamKeys: ['id'],
  });

  public listScopesByResource = this.makeRequest<
    {id: string; resourceName: string},
    {id: string; name: string}[]
  >({
    method: 'GET',
    path: '/{id}/authz/resource-server/resource/{resourceName}/scopes',
    urlParamKeys: ['id', 'resourceName'],
  });

  public createAuthorizationScope = this.makeUpdateRequest<
    {id: string},
    {name: string; displayName?: string; iconUri?: string}
  >({
    method: 'POST',
    path: '{id}/authz/resource-server/scope',
    urlParamKeys: ['id'],
  });

  /**
   * Permissions
   */
  public findPermissions = this.makeRequest<
    {id: string; name: string},
    PolicyRepresentation[]
  >({
    method: 'GET',
    path: '{id}/authz/resource-server/permission',
    urlParamKeys: ['id'],
  });

  public createPermission = this.makeUpdateRequest<
    {id: string; type: string},
    PolicyRepresentation,
    PolicyRepresentation
  >({
    method: 'POST',
    path: '/{id}/authz/resource-server/permission/{type}',
    urlParamKeys: ['id', 'type'],
  });

  public updatePermission = this.makeUpdateRequest<
    {id: string; type: string; permissionId: string},
    PolicyRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}/authz/resource-server/permission/{type}/{permissionId}',
    urlParamKeys: ['id', 'type', 'permissionId'],
  });

  public delPermission = this.makeRequest<
    {id: string; type: string; permissionId: string},
    void
  >({
    method: 'DELETE',
    path: '/{id}/authz/resource-server/permission/{type}/{permissionId}',
    urlParamKeys: ['id', 'type', 'permissionId'],
  });

  public findOnePermission = this.makeRequest<
    {id: string; type: string; permissionId: string},
    PolicyRepresentation
  >({
    method: 'GET',
    path: '/{id}/authz/resource-server/permission/{type}/{permissionId}',
    urlParamKeys: ['id', 'type', 'permissionId'],
  });

  public getAssociatedScopes = this.makeRequest<
    {id: string; permissionId: string},
    {id: string; name: string}[]
  >({
    method: 'GET',
    path: '/{id}/authz/resource-server/policy/{permissionId}/scopes',
    urlParamKeys: ['id', 'permissionId'],
  });

  public getAssociatedResources = this.makeRequest<
    {id: string; permissionId: string},
    {_id: string; name: string}[]
  >({
    method: 'GET',
    path: '/{id}/authz/resource-server/policy/{permissionId}/resources',
    urlParamKeys: ['id', 'permissionId'],
  });

  public getOfflineSessionCount = this.makeRequest<
    {id: string},
    {count: number}
  >({
    method: 'GET',
    path: '/{id}/offline-session-count',
    urlParamKeys: ['id'],
  });

  public getInstallationProviders = this.makeRequest<
    {id: string; providerId: string},
    string
  >({
    method: 'GET',
    path: '/{id}/installation/providers/{providerId}',
    urlParamKeys: ['id', 'providerId'],
  });

  public pushRevocation = this.makeRequest<{id: string}, GlobalRequestResult>({
    method: 'POST',
    path: '/{id}/push-revocation',
    urlParamKeys: ['id'],
  });

  public addClusterNode = this.makeRequest<{id: string; node: string}, void>({
    method: 'POST',
    path: '/{id}/nodes',
    urlParamKeys: ['id'],
  });

  public deleteClusterNode = this.makeRequest<{id: string; node: string}, void>(
    {
      method: 'DELETE',
      path: '/{id}/nodes/{node}',
      urlParamKeys: ['id', 'node'],
    },
  );

  public testNodesAvailable = this.makeRequest<
    {id: string},
    GlobalRequestResult
  >({
    method: 'GET',
    path: '/{id}/test-nodes-available',
    urlParamKeys: ['id'],
  });

  public getKeyInfo = this.makeRequest<
    {id: string; attr: string},
    CertificateRepresentation
  >({
    method: 'GET',
    path: '/{id}/certificates/{attr}',
    urlParamKeys: ['id', 'attr'],
  });

  public generateKey = this.makeRequest<
    {id: string; attr: string},
    CertificateRepresentation
  >({
    method: 'POST',
    path: '/{id}/certificates/{attr}/generate',
    urlParamKeys: ['id', 'attr'],
  });

  public downloadKey = this.makeUpdateRequest<
    {id: string; attr: string},
    KeyStoreConfig,
    string
  >({
    method: 'POST',
    path: '/{id}/certificates/{attr}/download',
    urlParamKeys: ['id', 'attr'],
  });

  public generateAndDownloadKey = this.makeUpdateRequest<
    {id: string; attr: string},
    KeyStoreConfig,
    string
  >({
    method: 'POST',
    path: '/{id}/certificates/{attr}/generate-and-download',
    urlParamKeys: ['id', 'attr'],
  });

  public uploadKey = this.makeUpdateRequest<{id: string; attr: string}, any>({
    method: 'POST',
    path: '/{id}/certificates/{attr}/upload',
    urlParamKeys: ['id', 'attr'],
  });

  public uploadCertificate = this.makeUpdateRequest<
    {id: string; attr: string},
    any
  >({
    method: 'POST',
    path: '/{id}/certificates/{attr}/upload-certificate',
    urlParamKeys: ['id', 'attr'],
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
