/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_federatedidentityrepresentation
 */

export default interface FederatedIdentityRepresentation {
  identityProvider?: string;
  userId?: string;
  userName?: string;
}
