/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_policyrepresentation
 */

export enum DecisionStrategy {
  AFFIRMATIVE = 'AFFIRMATIVE',
  UNANIMOUS = 'UNANIMOUS',
  CONSENSUS = 'CONSENSUS',
}

export enum Logic {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export default interface PolicyRepresentation {
  config?: Record<string, any>;
  decisionStrategy?: DecisionStrategy;
  description?: string;
  id?: string;
  logic?: Logic;
  name?: string;
  owner?: string;
  policies?: string[];
  resources?: string[];
  scopes?: string[];
  type?: string;
}
