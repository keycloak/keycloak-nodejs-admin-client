import ProtocolMapperRepresentation from './protocolMapperRepresentation';
export default interface ClientScopeRepresentation {
    attributes?: Record<string, any>;
    description?: string;
    id?: string;
    name?: string;
    protocol?: string;
    protocolMappers?: ProtocolMapperRepresentation[];
}
