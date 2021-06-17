import Resource from './resource';
import KeycloakAdminClient from '..';

export class AttackDetection extends Resource<{realm?: string}> {

  public findOne = this.makeRequest<{id: string}, Record<string, any>>({
    method: 'GET',
    path: '/users/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/users/{id}',
    urlParamKeys: ['id'],
  });

  public delAll = this.makeRequest<{}, void>({
    method: 'DELETE',
    path: '/users',
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}/attack-detection/brute-force',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
