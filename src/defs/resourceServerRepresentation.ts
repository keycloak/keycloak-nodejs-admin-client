/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_policyrepresentation
 */
import PolicyRepresentation from './policyRepresentation';
import ResourceRepresentation from './resourceRepresentation';
import ScopeRepresentation from './scopeRepresentation';

export default interface ResourceServerRepresentation {
  id?: string;
  clientId?: string;
  name?: string;
  allowRemoteResourceManagement?: boolean;
  policyEnforcementMode?: PolicyEnforcementMode;
  resources?: ResourceRepresentation[];
  policies?: PolicyRepresentation[];
  scopes?: ScopeRepresentation[];
  decisionStrategy?: DecisionStrategy;
}
export interface ResourceOwnerRepresentation {
  id?: string;
  name?: string;
}
export interface AbstractPolicyRepresentation {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  policies?: string[];
  resources?: string[];
  scopes?: string[];
  logic?: Logic;
  decisionStrategy?: DecisionStrategy;
  owner?: string;
  resourcesData?: ResourceRepresentation[];
  scopesData?: ScopeRepresentation[];
}

export type PolicyEnforcementMode = 'ENFORCING' | 'PERMISSIVE' | 'DISABLED';

export type DecisionStrategy = 'AFFIRMATIVE' | 'UNANIMOUS' | 'CONSENSUS';

export type Logic = 'POSITIVE' | 'NEGATIVE';
