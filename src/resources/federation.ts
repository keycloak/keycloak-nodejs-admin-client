import Resource from './resource';
import UserRepresentation from '../defs/userRepresentation';
import {KeycloakAdminClient} from '../client';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, {
  RoleMappingPayload,
} from '../defs/roleRepresentation';
import {RequiredActionAlias} from '../defs/requiredActionProviderRepresentation';
import FederatedIdentityRepresentation from '../defs/federatedIdentityRepresentation';
import GroupRepresentation from '../defs/groupRepresentation';
import CredentialRepresentation from '../defs/credentialRepresentation';

export interface UserQuery {
  email?: string;
  first?: number;
  firstName?: string;
  lastName?: string;
  max?: number;
  search?: string;
  username?: string;
}

export class Federation extends Resource<{realm?: string}> {
  // Triggers a keyCloack federation user synchronization.
  public triggerSync = this.makeRequest<{id: string}, void>({
    method: 'POST',
    path: '/{id}/sync?action=triggerFullSync',
    urlParamKeys: ['id'],
  });
  // public triggerSync = this.makeRequest({
  //   method: 'GET',
  // });

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
