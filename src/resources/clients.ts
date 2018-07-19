import Resource from './resource';
import ClientRepresentation from '../defs/clientRepresentation';
import { KeycloakAdminClient } from '../client';

export interface ClientQuery {
  clientId?: string;
  viewableOnly?: boolean;
}

export class Clients extends Resource {
  public find = this.makeRequest<ClientQuery, ClientRepresentation[]>({
    method: 'GET'
  });

  public create = this.makeRequest<ClientRepresentation, void>({
    method: 'POST'
  });

  /**
   * Single client
   */

  public findOne = this.makeRequest<{id: string}, ClientRepresentation>({
    method: 'GET',
    path: '/{id}',
    params: ['id'],
    catchNotFound: true
  });

  public update = this.makeUpdateRequest<{id: string}, ClientRepresentation, void>({
    method: 'PUT',
    path: '/{id}',
    params: ['id']
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    params: ['id']
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/clients',
      params: {
        realm: client.realmName
      }
    });
  }
}
