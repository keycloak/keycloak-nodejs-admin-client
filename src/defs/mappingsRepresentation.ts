/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_mappingsrepresentation
 */
import RoleRepresentation from './roleRepresentation';

export default interface MappingsRepresentation {
  clientMappings?: Record<string, any>;
  realmMappings?: RoleRepresentation[];
}
