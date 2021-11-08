/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_policyrepresentation
 */
import PolicyRepresentation from './policyRepresentation';
import ResourceRepresentation from './resourceRepresentation';
import ScopeRepresentation from './scopeRepresentation';

export enum PolicyEnforcementMode {
  ENFORCING = 'ENFORCING',
  PERMISSIVE = 'PERMISSIVE',
  DISABLED = 'DISABLED',
}

export enum DecisionStrategyOption {
  UNANIMOUS = 'UNANIMOUS',
  AFFIRMATIVE = 'AFFIRMATIVE',
}

export default interface ResourceServerRepresentation {
  allowRemoteResourceManagement?: boolean;
  clientId?: string;
  decisionStrategy: DecisionStrategyOption;
  id?: string;
  name?: string;
  policies?: PolicyRepresentation[];
  policyEnforcementMode?: PolicyEnforcementMode;
  resources?: ResourceRepresentation[];
  scopes?: ScopeRepresentation[];
}
