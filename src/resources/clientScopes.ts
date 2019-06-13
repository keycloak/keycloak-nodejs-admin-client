import ClientScopeRepresentation from '../defs/clientScopeRepresentation';
import Resource from './resource';
import {KeycloakAdminClient} from '../client';
import ProtocolMapperRepresentation from '../defs/protocolMapperRepresentation';

export class ClientScopes extends Resource<{realm?: string}> {
  public find = this.makeRequest<void, ClientScopeRepresentation[]>({
    method: 'GET',
    path: '/client-scopes',
  });

  public create = this.makeRequest<ClientScopeRepresentation, void>({
    method: 'POST',
    path: '/client-scopes',
  });

  /**
   * Client-Scopes by id
   */

  public findOneById = this.makeRequest<
    {id: string},
    ClientScopeRepresentation
  >({
    method: 'GET',
    path: '/client-scopes/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public updateById = this.makeUpdateRequest<
    {id: string},
    ClientScopeRepresentation,
    void
  >({
    method: 'PUT',
    path: '/client-scopes/{id}',
    urlParamKeys: ['id'],
  });

  public delById = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/client-scopes/{id}',
    urlParamKeys: ['id'],
  });

  /**
   * Default Client-Scopes
   */

  public listDefaultClientScopes = this.makeRequest<
    void,
    ClientScopeRepresentation[]
  >({
    method: 'GET',
    path: '/default-default-client-scopes',
  });

  public addDefaultClientScope = this.makeRequest<{id: string}, void>({
    method: 'PUT',
    path: '/default-default-client-scopes/{id}',
    urlParamKeys: ['id'],
  });

  public delDefaultClientScope = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/default-default-client-scopes/{id}',
    urlParamKeys: ['id'],
  });

  /**
   * Default Optional Client-Scopes
   */

  public listDefaultOptionalClientScopes = this.makeRequest<
    void,
    ClientScopeRepresentation[]
  >({
    method: 'GET',
    path: '/default-optional-client-scopes',
  });

  public addDefaultOptionalClientScope = this.makeRequest<{id: string}, void>({
    method: 'PUT',
    path: '/default-optional-client-scopes/{id}',
    urlParamKeys: ['id'],
  });

  public delDefaultOptionalClientScope = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/default-optional-client-scopes/{id}',
    urlParamKeys: ['id'],
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
    path: '/client-scopes/{id}/protocol-mappers/add-models',
    urlParamKeys: ['id'],
  });

  public addProtocolMapper = this.makeUpdateRequest<
    {id: string},
    ProtocolMapperRepresentation,
    void
  >({
    method: 'POST',
    path: '/client-scopes/{id}/protocol-mappers/models',
    urlParamKeys: ['id'],
  });

  public listProtocolMappers = this.makeRequest<
    {id: string},
    ProtocolMapperRepresentation[]
  >({
    method: 'GET',
    path: '/client-scopes/{id}/protocol-mappers/models',
    urlParamKeys: ['id'],
  });

  public findProtocolMapperById = this.makeRequest<
    {id: string; mapperId: string},
    ProtocolMapperRepresentation
  >({
    method: 'GET',
    path: '/client-scopes/{id}/protocol-mappers/models/{mapperId}',
    urlParamKeys: ['id', 'mapperId'],
    catchNotFound: true,
  });

  public findProtocolMappersByProtocol = this.makeRequest<
    {id: string; protocol: string},
    ProtocolMapperRepresentation[]
  >({
    method: 'GET',
    path: '/client-scopes/{id}/protocol-mappers/protocol/{protocol}',
    urlParamKeys: ['id', 'protocol'],
    catchNotFound: true,
  });

  public updateProtocolMapper = this.makeUpdateRequest<
    {id: string; mapperId: string},
    ProtocolMapperRepresentation,
    void
  >({
    method: 'PUT',
    path: '/client-scopes/{id}/protocol-mappers/models/{mapperId}',
    urlParamKeys: ['id', 'mapperId'],
  });

  public delProtocolMapper = this.makeRequest<
    {id: string; mapperId: string},
    void
  >({
    method: 'DELETE',
    path: '/client-scopes/{id}/protocol-mappers/models/{mapperId}',
    urlParamKeys: ['id', 'mapperId'],
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

  /**
   * Find client scope by name.
   */
  public async findOneByName(payload: {
    name: string;
  }): Promise<ClientScopeRepresentation> {
    const allScopes = await this.find();
    const scope = allScopes.find(item => item.name === payload.name);
    return scope ? scope : null;
  }

  /**
   * Find client scope by name.
   */
  public async delByName(payload: {name: string}): Promise<void> {
    const scope = await this.findOneByName(payload);

    if (!scope) {
      throw new Error('Scope not found.');
    }

    await this.delById({id: scope.id});
  }

  /**
   * Find single protocol mapper by name.
   */
  public async findProtocolMapperByName(payload: {
    id: string;
    name: string;
  }): Promise<ProtocolMapperRepresentation> {
    const allProtocolMappers = await this.listProtocolMappers({
      id: payload.id,
    });
    const protocolMapper = allProtocolMappers.find(
      mapper => mapper.name === payload.name,
    );
    return protocolMapper ? protocolMapper : null;
  }
}
