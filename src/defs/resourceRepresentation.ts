/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_resourcerepresentation
 */
import ScopeRepresentation from './scopeRepresentation';

export default interface ResourceRepresentation {
  _id?: string;
  attributes?: Record<string, any>;
  displayName?: string;
  icon_uri?: string;
  name?: string;
  ownerManagedAccess?: boolean;
  scopes?: ScopeRepresentation[];
  type?: string;
  uri?: string;
}
