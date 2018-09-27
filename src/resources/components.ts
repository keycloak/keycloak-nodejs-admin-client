import Resource from './resource';
import ComponentRepresentation from '../defs/componentRepresentation';
import {KeycloakAdminClient} from '../client';

export interface ComponentQuery {
  name?: string;
  parent?: string;
  type?: string;
}

export class Components extends Resource<{realm?: string}> {
  /**
   * components
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_component_resource
   */

  public find = this.makeRequest<ComponentQuery, ComponentRepresentation[]>({
    method: 'GET'
  });

  public create = this.makeRequest<ComponentRepresentation, void>({
    method: 'POST'
  });

  public findOne = this.makeRequest<{id: string}, ComponentRepresentation>({
    method: 'GET',
    path: '/{id}',
    urlParams: ['id'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<
    {id: string},
    ComponentRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}',
    urlParams: ['id']
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    urlParams: ['id']
  });

  constructor(
    client: KeycloakAdminClient,
    settings: {realmName?: string; baseUrl?: string} = {}
  ) {
    super(client, {
      path: '/admin/realms/{realm}/components',
      getUrlParams: () => ({
        realm: settings.realmName || client.realmName
      }),
      getBaseUrl: () => settings.baseUrl || client.baseUrl
    });
  }
}
