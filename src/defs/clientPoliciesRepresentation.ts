import ClientPolicyRepresentation from './clientPolicyRepresentation';

/**
 * https://www.keycloak.org/docs-api/15.0/rest-api/#_clientpoliciesrepresentation
 */
export default interface ClientPoliciesRepresentation {
  policies?: ClientPolicyRepresentation[];
}
