import Resource from './resource';
import IdentityProviderRepresentation from '../defs/identityProviderRepresentation';
import {KeycloakAdminClient} from '../client';

export class IdentityProviders extends Resource<{realm?: string}> {
  /**
   * Identity provider
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_identity_providers_resource
   */

  public find = this.makeRequest<void, IdentityProviderRepresentation[]>({
    method: 'GET'
  });

  public create = this.makeRequest<IdentityProviderRepresentation, void>({
    method: 'POST'
  });

  public findOne = this.makeRequest<
    {alias: string},
    IdentityProviderRepresentation
  >({
    method: 'GET',
    path: '/{alias}',
    urlParamKeys: ['alias'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<
    {alias: string},
    IdentityProviderRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{alias}',
    urlParamKeys: ['alias']
  });

  public del = this.makeRequest<{alias: string}, void>({
    method: 'DELETE',
    path: '/{alias}',
    urlParamKeys: ['alias']
  });

  constructor(
    client: KeycloakAdminClient,
    settings: {realmName?: string; baseUrl?: string} = {}
  ) {
    super(client, {
      path: '/admin/realms/{realm}/identity-provider/instances',
      getUrlParams: () => ({
        realm: settings.realmName || client.realmName
      }),
      getBaseUrl: () => settings.baseUrl || client.baseUrl
    });
  }
}
