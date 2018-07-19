/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_clientrepresentation
 */
import ResourceServerRepresentation from './resourceServerRepresentation';
import ProtocolMapperRepresentation from './protocolMapperRepresentation';

export default interface ClientRepresentation {
  access?: Record<string, boolean>;
  adminUrl?: string;
  attributes?: Record<string, any>;
  authenticationFlowBindingOverrides?: Record<string, any>;
  authorizationServicesEnabled?: boolean;
  authorizationSettings?: ResourceServerRepresentation;
  baseUrl?: string;
  bearerOnly?: boolean;
  clientAuthenticatorType?: string;
  clientId?: string;
  consentRequired?: boolean;
  defaultClientScopes?: string[];
  defaultRoles?: string[];
  description?: string;
  directAccessGrantsEnabled?: boolean;
  enabled?: boolean;
  frontchannelLogout?: boolean;
  fullScopeAllowed?: boolean;
  id?: string;
  implicitFlowEnabled?: boolean;
  name?: string;
  nodeReRegistrationTimeout?: number;
  notBefore?: number;
  optionalClientScopes?: string[];
  origin?: string;
  protocol?: string;
  protocolMappers?: ProtocolMapperRepresentation[];
  publicClient?: boolean;
  redirectUris?: string[];
  registeredNodes?: Record<string, any>;
  registrationAccessToken?: string;
  rootUrl?: string;
  secret?: string;
  serviceAccountsEnabled?: boolean;
  standardFlowEnabled?: boolean;
  surrogateAuthRequired?: boolean;
  webOrigins?: string[];
}
