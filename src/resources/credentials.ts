import Resource from './resource';
import CredentialsRepresentation from '../defs/credentialsRepresentation';
import {KeycloakAdminClient} from '../client';

export class Credentials extends Resource<{realm?: string}> {
  /**
   * User Storage
   * https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_user_storage_provider_resource
   */

  public getCredentials = this.makeRequest<{id: string}, CredentialsRepresentation[]>({
    method: 'GET',
    path: '/{id}/credentials',
    urlParamKeys: ['id'],
  });

  public updateUserLabel = this.makeUpdateRequest<{id: string}, string, void>({
    method: 'GET',
    path: '/{id}/credentials/{credId}/userLabel',
    urlParamKeys: ['id', 'credId'],
  });

  public deleteCredential = this.makeRequest<{id: string, credId: string}, void>({
    method: 'DELETE',
    path: '/{id}/credentials/{credId}',
    urlParamKeys: ['id', 'credId'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/users',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
