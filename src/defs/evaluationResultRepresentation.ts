import PolicyRepresentation, {DecisionEffect} from './policyRepresentation';
import PolicyResultRepresentation from './policyResultRepresentation';
import ResourceRepresentation from './resourceRepresentation';
import ScopeRepresentation from './scopeRepresentation';

export default interface EvaluationResultRepresentation {
  resource?: ResourceRepresentation;
  scopes?: ScopeRepresentation[];
  policies?: PolicyResultRepresentation[];
  status?: DecisionEffect;
  allowedScopes?: ScopeRepresentation[];
}
