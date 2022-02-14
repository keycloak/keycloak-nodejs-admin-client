import AccessTokenRepresentation from './accessTokenRepresentation';
import EvaluationResultRepresentation from './evaluationResultRepresentation';
import {DecisionEffect} from './policyRepresentation';

export default interface PolicyEvaluationResponse {
  results?: EvaluationResultRepresentation[];
  entitlements?: boolean;
  status?: DecisionEffect;
  rpt?: AccessTokenRepresentation;
}
