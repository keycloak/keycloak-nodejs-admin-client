import ClientRepresentation from './clientRepresentation';
import ComponentExportRepresentation from './componentExportRepresentation';
import UserRepresentation from './userRepresentation';
import GroupRepresentation from './groupRepresentation';
import IdentityProviderRepresentation from './identityProviderRepresentation';
import RequiredActionProviderRepresentation from './requiredActionProviderRepresentation';
import RolesRepresentation from './rolesRepresentation';
import ClientProfilesRepresentation from './clientProfilesRepresentation';
import ClientPoliciesRepresentation from './clientPoliciesRepresentation';
import RoleRepresentation from './roleRepresentation';

/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_realmrepresentation
 */

export default interface RealmRepresentation {
  accessCodeLifespan?: number;
  accessCodeLifespanLogin?: number;
  accessCodeLifespanUserAction?: number;
  accessTokenLifespan?: number;
  accessTokenLifespanForImplicitFlow?: number;
  accountTheme?: string;
  actionTokenGeneratedByAdminLifespan?: number;
  actionTokenGeneratedByUserLifespan?: number;
  adminEventsDetailsEnabled?: boolean;
  adminEventsEnabled?: boolean;
  adminTheme?: string;
  attributes?: Record<string, any>;
  // AuthenticationFlowRepresentation
  authenticationFlows?: any[];
  // AuthenticatorConfigRepresentation
  authenticatorConfig?: any[];
  browserFlow?: string;
  browserSecurityHeaders?: Record<string, any>;
  bruteForceProtected?: boolean;
  clientAuthenticationFlow?: string;
  clientScopeMappings?: Record<string, any>;
  // ClientScopeRepresentation
  clientScopes?: any[];
  clients?: ClientRepresentation[];
  clientPolicies?: ClientPoliciesRepresentation;
  clientProfiles?: ClientProfilesRepresentation;
  components?: {[index: string]: ComponentExportRepresentation};
  defaultDefaultClientScopes?: string[];
  defaultGroups?: string[];
  defaultLocale?: string;
  defaultOptionalClientScopes?: string[];
  defaultRoles?: string[];
  defaultRole?: RoleRepresentation;
  directGrantFlow?: string;
  displayName?: string;
  displayNameHtml?: string;
  dockerAuthenticationFlow?: string;
  duplicateEmailsAllowed?: boolean;
  editUsernameAllowed?: boolean;
  emailTheme?: string;
  enabled?: boolean;
  enabledEventTypes?: string[];
  eventsEnabled?: boolean;
  eventsExpiration?: number;
  eventsListeners?: string[];
  failureFactor?: number;
  federatedUsers?: UserRepresentation[];
  groups?: GroupRepresentation[];
  id?: string;
  // IdentityProviderMapperRepresentation
  identityProviderMappers?: any[];
  identityProviders?: IdentityProviderRepresentation[];
  internationalizationEnabled?: boolean;
  keycloakVersion?: string;
  loginTheme?: string;
  loginWithEmailAllowed?: boolean;
  maxDeltaTimeSeconds?: number;
  maxFailureWaitSeconds?: number;
  minimumQuickLoginWaitSeconds?: number;
  notBefore?: number;
  offlineSessionIdleTimeout?: number;
  offlineSessionMaxLifespan?: number;
  offlineSessionMaxLifespanEnabled?: boolean;
  otpPolicyAlgorithm?: string;
  otpPolicyDigits?: number;
  otpPolicyInitialCounter?: number;
  otpPolicyLookAheadWindow?: number;
  otpPolicyPeriod?: number;
  otpPolicyType?: string;
  otpSupportedApplications?: string[];
  passwordPolicy?: string;
  permanentLockout?: boolean;
  // ProtocolMapperRepresentation
  protocolMappers?: any[];
  quickLoginCheckMilliSeconds?: number;
  realm?: string;
  refreshTokenMaxReuse?: number;
  registrationAllowed?: boolean;
  registrationEmailAsUsername?: boolean;
  registrationFlow?: string;
  rememberMe?: boolean;
  requiredActions?: RequiredActionProviderRepresentation[];
  resetCredentialsFlow?: string;
  resetPasswordAllowed?: boolean;
  revokeRefreshToken?: boolean;
  roles?: RolesRepresentation;
  // ScopeMappingRepresentation
  scopeMappings?: any[];
  smtpServer?: Record<string, any>;
  sslRequired?: string;
  ssoSessionIdleTimeout?: number;
  ssoSessionMaxLifespan?: number;
  supportedLocales?: string[];
  // UserFederationMapperRepresentation
  userFederationMappers?: any[];
  // UserFederationProviderRepresentation
  userFederationProviders?: any[];
  userManagedAccessAllowed?: boolean;
  users?: UserRepresentation[];
  verifyEmail?: boolean;
  waitIncrementSeconds?: number;
}

export type PartialImportRealmRepresentation = RealmRepresentation & {
  ifResourceExists: 'FAIL' | 'SKIP' | 'OVERWRITE';
};

export type PartialImportResponse = {
  overwritten: number;
  added: number;
  skipped: number;
  results: PartialImportResult[];
};

export type PartialImportResult = {
  action: string;
  resourceType: string;
  resourceName: string;
  id: string;
};
