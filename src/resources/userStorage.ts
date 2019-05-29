import Resource from './resource';
import {KeycloakAdminClient} from '../client';

export class UserStorage extends Resource<{realm?: string}> {
  /**
   * User Storage
   * https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_user_storage_provider_resource
   */

  public triggerFullSync = this.makeRequest<{id: string}, void>({
    method: 'POST',
    path: '/{id}/sync?action=triggerFullSync',
    urlParamKeys: ['id'],
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/user-storage',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
