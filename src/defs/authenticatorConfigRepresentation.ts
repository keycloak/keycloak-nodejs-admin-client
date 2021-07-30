
/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_authenticatorconfigrepresentation
 */
export default interface AuthenticatorConfigRepresentation {
  id?: string;
  alias?: string;
  config?: {[index: string]: string};
}
