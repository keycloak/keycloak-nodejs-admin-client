/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_userconsentrepresentation
 */

export default interface UserConsentRepresentation {
  clientId: string;
  createDate: string;
  grantedClientScopes: string[];
  lastUpdatedDate: number;
}
