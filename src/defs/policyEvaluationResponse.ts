import AccessTokenRepresentation from './accessTokenRepresentation';
import EvaluationResultRepresentation from './evaluationResultRepresentation';

export default interface PolicyEvaluationResponse {
  results?: EvaluationResultRepresentation[];
  entitlements?: boolean;
  status?: DecisionEffect;
  rpt?: AccessTokenRepresentation;
}
