import UserConsentRepresentation from './userConsentRepresentation';
import CredentialRepresentation from './credentialRepresentation';
import FederatedIdentityRepresentation from './federatedIdentityRepresentation';
import { RequiredActionAlias } from './requiredActionProviderRepresentation';

export default interface UserRepresentation {
  id?: string;
  createdTimestamp?: number;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  disableableCredentialTypes?: string[];
  requiredActions?: RequiredActionAlias[];
  notBefore?: number;
  access?: Record<string, boolean>;

  // optional from response
  attributes?: Record<string, any>;
  clientConsents?: UserConsentRepresentation[];
  clientRoles?: Record<string, any>;
  credentials?: CredentialRepresentation[];
  email?: string;
  federatedIdentities?: FederatedIdentityRepresentation[];
  federationLink?: string;
  firstName?: string;
  groups?: string[];
  lastName?: string;
  origin?: string;
  realmRoles?: string[];
  self?: string;
  serviceAccountClientId?: string;
}
