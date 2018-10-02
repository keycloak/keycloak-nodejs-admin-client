/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_policyrepresentation
 */
import PolicyRepresentation from './policyRepresentation';
import ResourceRepresentation from './resourceRepresentation';
import ScopeRepresentation from './scopeRepresentation';

export enum PolicyEnforcementMode {
  ENFORCING = 'ENFORCING',
  PERMISSIVE = 'PERMISSIVE',
  DISABLED = 'DISABLED',
}

export default interface ResourceServerRepresentation {
  allowRemoteResourceManagement?: boolean;
  clientId?: string;
  id?: string;
  name?: string;
  policies?: PolicyRepresentation[];
  policyEnforcementMode?: PolicyEnforcementMode;
  resources?: ResourceRepresentation[];
  scopes?: ScopeRepresentation[];
}
