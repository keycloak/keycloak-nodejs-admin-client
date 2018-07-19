/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_protocolmapperrepresentation
 */

export default interface ProtocolMapperRepresentation {
  config?: Record<string, any>;
  id?: string;
  name?: string;
  protocol?: string;
  protocolMapper?: string;
}
