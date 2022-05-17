import Resource from './resource';
import KeycloakAdminClient from '..';
import ClientSessionStats from '../defs/ClientSessionStats';

export class Sessions extends Resource<{realm?: string}> {
  public getClientSessionStats = this.makeRequest<{}, ClientSessionStats[]>({
    method: 'GET',
    path: '/client-session-stats',
  });

  public delete = this.makeRequest<{session: string;}, void>({
    method: 'DELETE',
    path: '/sessions/{session}',
  });

  constructor(client: KeycloakAdminClient) {
    super(client, {
      path: '/admin/realms/{realm}',
      getUrlParams: () => ({
        realm: client.realmName,
      }),
      getBaseUrl: () => client.baseUrl,
    });
  }
}
