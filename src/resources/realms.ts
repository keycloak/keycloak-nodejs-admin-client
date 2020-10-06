import Resource from './resource';
import AdminEventRepresentation from '../defs/adminEventRepresentation';
import RealmRepresentation from '../defs/realmRepresentation';
import EventRepresentation from '../defs/eventRepresentation';
import EventType from '../defs/eventTypes';

import {KeycloakAdminClient} from '../client';

export class Realms extends Resource {
  /**
   * Realm
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_realms_admin_resource
   */

  public find = this.makeRequest<void, RealmRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<RealmRepresentation, {realmName: string}>({
    method: 'POST',
    returnResourceIdInLocationHeader: {field: 'realmName'},
  });

  public findOne = this.makeRequest<{realm: string}, RealmRepresentation>({
    method: 'GET',
    path: '/{realm}',
    urlParamKeys: ['realm'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    {realm: string},
    RealmRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{realm}',
    urlParamKeys: ['realm'],
  });

  public del = this.makeRequest<{realm: string}, void>({
    method: 'DELETE',
    path: '/{realm}',
    urlParamKeys: ['realm'],
  });

  /**
   * Get events Returns all events, or filters them based on URL query parameters listed here
   */
  public findEvents = this.makeRequest<
    {
      realm: string;
      client?: string;
      dateFrom?: Date;
      dateTo?: Date;
      first?: number;
      ipAddress?: string;
      max?: number;
      type?: EventType;
      user?: string;
    },
    EventRepresentation[]
  >({
    method: 'GET',
    path: '/{realm}/events',
    urlParamKeys: ['realm'],
    queryParamKeys: [
      'client',
      'dateFrom',
      'dateTo',
      'first',
      'ipAddress',
      'max',
      'type',
      'user',
    ],
  });

  /**
   * Get admin events Returns all admin events, or filters events based on URL query parameters listed here
   */
  public findAdminEvents = this.makeRequest<
    {
      realm: string;
      authClient?: string;
      authIpAddress?: string;
      authRealm?: string;
      authUser?: string;
      dateFrom?: Date;
      dateTo?: Date;
      first?: number;
      max?: number;
      operationTypes?: string;
      resourcePath?: string;
      resourceTypes?: string;
    },
    AdminEventRepresentation[]
  >({
    method: 'GET',
    path: '/{realm}/admin-events',
    urlParamKeys: ['realm'],
    queryParamKeys: [
      'authClient',
      'authIpAddress',
      'authRealm',
      'authUser',
      'dateFrom',
      'dateTo',
      'max',
      'first',
      'operationTypes',
      'resourcePath',
      'resourceTypes',
    ],
  });

  /**
   * Users management permissions
   */
  public getUsersManagementPermissions = this.makeRequest<
    {realm: string},
    void
  >({
    method: 'GET',
    path: '/{realm}/users-management-permissions',
    urlParamKeys: ['realm'],
  });

  public updateUsersManagementPermissions = this.makeRequest<
    {realm: string; enabled: boolean},
    void
  >({
    method: 'PUT',
    path: '/{realm}/users-management-permissions',
    urlParamKeys: ['realm'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms',
      getBaseUrl: () => client.baseUrl,
    });
  }
}
