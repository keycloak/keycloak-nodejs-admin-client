/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_identityprovidermapperrepresentation
 */

export default interface IdentityProviderMapperRepresentation {
  config?: any;
  id?: string;
  identityProviderAlias?: string;
  identityProviderMapper?: string;
  name?: string;
}
