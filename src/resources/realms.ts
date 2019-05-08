import Resource from './resource';
import RealmRepresentation from '../defs/realmRepresentation';
import EventRepresentation from '../defs/eventRepresentation';

import { KeycloakAdminClient } from '../client';

export class Realms extends Resource {
  /**
   * Realm
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_realms_admin_resource
   */

  public find = this.makeRequest<void, RealmRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<RealmRepresentation, { realmName: string }>({
    method: 'POST',
    returnResourceIdInLocationHeader: { field: 'realmName' },
  });

  public findOne = this.makeRequest<{ realm: string }, RealmRepresentation>({
    method: 'GET',
    path: '/{realm}',
    urlParamKeys: ['realm'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    { realm: string },
    RealmRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{realm}',
    urlParamKeys: ['realm'],
  });

  public del = this.makeRequest<{ realm: string }, void>({
    method: 'DELETE',
    path: '/{realm}',
    urlParamKeys: ['realm'],
  });

  /**
   * Get events Returns all events, or filters them based on URL query parameters listed here
   */
  public findEvents = this.makeRequest<{
    realm: string,
    client?: string, dateFrom?: Date, dateTo?: Date,
    first?: number, ipAddress?: string, max?: number,
    type?: string, user?: string,
  }, EventRepresentation>({
    method: 'GET',
    path: '/{realm}/events',
    urlParamKeys: ['realm'],
    queryParamKeys: ['client', 'dateFrom', 'dateTo', 'first', 'ipAddress', 'max', 'type', 'user'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms',
      getBaseUrl: () => client.baseUrl,
    });
  }
}
