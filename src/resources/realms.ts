import Resource from './resource';
import AdminEventRepresentation from '../defs/adminEventRepresentation';
import RealmRepresentation, {
  PartialImportRealmRepresentation,
  PartialImportResponse,
} from '../defs/realmRepresentation';
import EventRepresentation from '../defs/eventRepresentation';
import EventType from '../defs/eventTypes';
import KeysMetadataRepresentation from '../defs/keyMetadataRepresentation';
import ClientInitialAccessPresentation from '../defs/clientInitialAccessPresentation';
import TestLdapConnectionRepresentation from '../defs/testLdapConnection';

import {KeycloakAdminClient} from '../client';
import {RealmEventsConfigRepresentation} from '../defs/realmEventsConfigRepresentation';
import ComponentRepresentation from '../defs/componentRepresentation';
import GlobalRequestResult from '../defs/globalRequestResult';

export class Realms extends Resource {
  /**
   * Realm
   * https://www.keycloak.org/docs-api/11.0/rest-api/#_realms_admin_resource
   */

  public find = this.makeRequest<{}, RealmRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<RealmRepresentation, {realmName: string}>({
    method: 'POST',
    returnResourceIdInLocationHeader: {field: 'realmName'},
  });

  public findOne = this.makeRequest<
    {realm: string},
    RealmRepresentation | undefined
  >({
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

  public partialImport = this.makeRequest<
    {
      realm: string;
      rep: PartialImportRealmRepresentation;
    },
    PartialImportResponse
  >({
    method: 'POST',
    path: '/{realm}/partialImport',
    urlParamKeys: ['realm'],
    payloadKey: 'rep',
  });

  public export = this.makeRequest<
    {
      realm: string;
      exportClients?: boolean;
      exportGroupsAndRoles?: boolean;
    },
    RealmRepresentation
  >({
    method: 'POST',
    path: '/{realm}/partial-export',
    urlParamKeys: ['realm'],
    queryParamKeys: ['exportClients', 'exportGroupsAndRoles'],
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
      type?: EventType | EventType[];
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

  public getConfigEvents = this.makeRequest<
    {realm: string},
    RealmEventsConfigRepresentation
  >({
    method: 'GET',
    path: '/{realm}/events/config',
    urlParamKeys: ['realm'],
  });

  public updateConfigEvents = this.makeUpdateRequest<
    {realm: string},
    RealmEventsConfigRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{realm}/events/config',
    urlParamKeys: ['realm'],
  });

  public clearEvents = this.makeRequest<{realm: string}, void>({
    method: 'DELETE',
    path: '/{realm}/events',
    urlParamKeys: ['realm'],
  });

  public clearAdminEvents = this.makeRequest<{realm: string}, void>({
    method: 'DELETE',
    path: '/{realm}/admin-events',
    urlParamKeys: ['realm'],
  });

  public getClientsInitialAccess = this.makeRequest<
    {realm: string},
    ClientInitialAccessPresentation[]
  >({
    method: 'GET',
    path: '/{realm}/clients-initial-access',
    urlParamKeys: ['realm'],
  });

  public createClientsInitialAccess = this.makeUpdateRequest<
    {realm: string},
    {count?: number; expiration?: number},
    ClientInitialAccessPresentation
  >({
    method: 'POST',
    path: '/{realm}/clients-initial-access',
    urlParamKeys: ['realm'],
  });

  public delClientsInitialAccess = this.makeRequest<
    {realm: string; id: string},
    void
  >({
    method: 'DELETE',
    path: '/{realm}/clients-initial-access/{id}',
    urlParamKeys: ['realm', 'id'],
  });

  /**
   * Remove a specific user session.
   */
  public removeSession = this.makeRequest<
    {realm: string; sessionId: string},
    void
  >({
    method: 'DELETE',
    path: '/{realm}/sessions/{session}',
    urlParamKeys: ['realm', 'session'],
    catchNotFound: true,
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

  /**
   * Sessions
   */
  public logoutAll = this.makeRequest<{realm: string}, void>({
    method: 'POST',
    path: '/{realm}/logout-all',
    urlParamKeys: ['realm'],
  });

  public deleteSession = this.makeRequest<
    {realm: string; session: string},
    void
  >({
    method: 'DELETE',
    path: '/{realm}/sessions/{session}',
    urlParamKeys: ['realm', 'session'],
  });

  public pushRevocation = this.makeRequest<
    {realm: string},
    GlobalRequestResult
  >({
    method: 'POST',
    path: '/{realm}/push-revocation',
    urlParamKeys: ['realm'],
    ignoredKeys: ['realm'],
  });

  public getKeys = this.makeRequest<
    {realm: string},
    KeysMetadataRepresentation
  >({
    method: 'GET',
    path: '/{realm}/keys',
    urlParamKeys: ['realm'],
  });

  public testLDAPConnection = this.makeUpdateRequest<
    {realm: string},
    TestLdapConnectionRepresentation
  >({
    method: 'POST',
    path: '/{realm}/testLDAPConnection',
    urlParamKeys: ['realm'],
  });

  public testSMTPConnection = this.makeUpdateRequest<
    {realm: string},
    Record<string, string | number>
  >({
    method: 'POST',
    path: '/{realm}/testSMTPConnection',
    urlParamKeys: ['realm'],
  });

  public getRealmSpecificLocales = this.makeRequest<{realm: string}, string[]>({
    method: 'GET',
    path: '/{realm}/localization',
    urlParamKeys: ['realm'],
  });

  public getRealmLocalizationTexts = this.makeRequest<
    {realm: string; selectedLocale: string},
    Record<string, string>
  >({
    method: 'GET',
    path: '/{realm}/localization/{selectedLocale}',
    urlParamKeys: ['realm', 'selectedLocale'],
  });

  public addLocalization = this.makeUpdateRequest<
    {realm: string; selectedLocale: string; key: string},
    string,
    void
  >({
    method: 'PUT',
    path: '/{realm}/localization/{selectedLocale}/{key}',
    urlParamKeys: ['realm', 'selectedLocale', 'key'],
  });

  public deleteRealmLocalizationTexts = this.makeRequest<
    {realm: string; selectedLocale: string; key?: string},
    void
  >({
    method: 'DELETE',
    path: '/{realm}/localization/{selectedLocale}/{key}',
    urlParamKeys: ['realm', 'selectedLocale', 'key'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms',
      getBaseUrl: () => client.baseUrl,
    });
  }
}
