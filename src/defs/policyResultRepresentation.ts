import PolicyRepresentation, {DecisionEffect} from './policyRepresentation';
import ScopeRepresentation from './scopeRepresentation';

export default interface PolicyResultRepresentation {
  policy?: PolicyRepresentation;
  status?: DecisionEffect;
  associatedPolicies?: PolicyResultRepresentation[];
  scopes?: ScopeRepresentation[];
}
