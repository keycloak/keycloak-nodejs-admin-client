/**
 * https://www.keycloak.org/docs-api/6.0/rest-api/index.html#_clientscoperepresentation
 */
import ProtocolMapperRepresentation from './protocolMapperRepresentation';

export default interface ClientScopeRepresentation {
  attributes?: Record<string, any>;
  description?: string;
  id?: string;
  name?: string;
  protocol?: string;
  protocolMappers?: ProtocolMapperRepresentation[];
}
