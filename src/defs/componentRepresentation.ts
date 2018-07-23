/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_componentrepresentation
 */
import MultivaluedHashMap from './multivaluedHashMap';

export default interface ComponentRepresentation {
  config?: MultivaluedHashMap;
  id?: string;
  name?: string;
  parentId?: string;
  providerId?: string;
  providerType?: string;
  subType?: string;
}
