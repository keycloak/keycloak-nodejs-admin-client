import Resource from './resource';
import IdentityProviderRepresentation from '../defs/identityProviderRepresentation';
import IdentityProviderMapperRepresentation from '../defs/identityProviderMapperRepresentation';
import {KeycloakAdminClient} from '../client';

export class IdentityProviders extends Resource<{realm?: string}> {
  /**
   * Identity provider
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_identity_providers_resource
   */

  public find = this.makeRequest<void, IdentityProviderRepresentation[]>({
    method: 'GET',
    path: '/instances',
  });

  public create = this.makeRequest<
    IdentityProviderRepresentation,
    {id: string}
  >({
    method: 'POST',
    path: '/instances',
    returnResourceIdInLocationHeader: {field: 'id'},
  });

  public findOne = this.makeRequest<
    {alias: string},
    IdentityProviderRepresentation
  >({
    method: 'GET',
    path: '/instances/{alias}',
    urlParamKeys: ['alias'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    {alias: string},
    IdentityProviderRepresentation,
    void
  >({
    method: 'PUT',
    path: '/instances/{alias}',
    urlParamKeys: ['alias'],
  });

  public del = this.makeRequest<{alias: string}, void>({
    method: 'DELETE',
    path: '/instances/{alias}',
    urlParamKeys: ['alias'],
  });

  public findFactory = this.makeRequest<{providerId: string}, any>({
    method: 'GET',
    path: '/providers/{providerId}',
    urlParamKeys: ['providerId'],
  });

  public findMappers = this.makeRequest<
    {alias: string},
    IdentityProviderMapperRepresentation[]
  >({
    method: 'GET',
    path: '/instances/{alias}/mappers',
    urlParamKeys: ['alias'],
  });

  public findOneMapper = this.makeRequest<
    {alias: string; id: string},
    IdentityProviderMapperRepresentation
  >({
    method: 'GET',
    path: '/instances/{alias}/mappers/{id}',
    urlParamKeys: ['alias', 'id'],
    catchNotFound: true,
  });

  public createMapper = this.makeRequest<
    {
      alias: string;
      identityProviderMapper: IdentityProviderMapperRepresentation;
    },
    {id: string}
  >({
    method: 'POST',
    path: '/instances/{alias}/mappers',
    urlParamKeys: ['alias'],
    payloadKey: 'identityProviderMapper',
    returnResourceIdInLocationHeader: {field: 'id'},
  });

  public updateMapper = this.makeUpdateRequest<
    {alias: string; id: string},
    IdentityProviderMapperRepresentation,
    void
  >({
    method: 'PUT',
    path: '/instances/{alias}/mappers/{id}',
    urlParamKeys: ['alias', 'id'],
  });

  public delMapper = this.makeRequest<{alias: string; id: string}, void>({
    method: 'DELETE',
    path: '/instances/{alias}/mappers/{id}',
    urlParamKeys: ['alias', 'id'],
  });

  public findMapperTypes = this.makeRequest<
    {alias: string},
    IdentityProviderMapperRepresentation[]
  >({
    method: 'GET',
    path: '/instances/{alias}/mapper-types',
    urlParamKeys: ['alias'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/identity-provider',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
