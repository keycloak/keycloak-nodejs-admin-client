import Resource from './resource.js';
import type ComponentTypeRepresentation from '../defs/componentTypeRepresentation.js';
import type {KeycloakAdminClient} from '../client.js';

export class ClientRegistrationPolicies extends Resource<{realm?: string}> {
  /**
   * client registration policies
   * https://www.keycloak.org/docs-api/15.0/rest-api/index.html#_client_registration_policy_resource
   */

  public find = this.makeRequest<{}, ComponentTypeRepresentation[]>({
    method: 'GET',
		path:'/client-registration-policy/providers'
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
