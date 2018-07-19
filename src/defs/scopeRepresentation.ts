/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_scoperepresentation
 */
import PolicyRepresentation from './policyRepresentation';
import ResourceRepresentation from './resourceRepresentation';

export default interface ScopeRepresentation {
  displayName?: string;
  iconUri?: string;
  id?: string;
  name?: string;
  policies?: PolicyRepresentation[];
  resources?: ResourceRepresentation[];
}
