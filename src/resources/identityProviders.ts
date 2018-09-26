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
    urlParams: ['alias'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<
    {alias: string},
    IdentityProviderRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{alias}',
    urlParams: ['alias']
  });

  public del = this.makeRequest<{alias: string}, void>({
    method: 'DELETE',
    path: '/{alias}',
    urlParams: ['alias']
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/identity-provider/instances',
      urlParams: {
        realm: client.realmName
      }
    });
  }
}
