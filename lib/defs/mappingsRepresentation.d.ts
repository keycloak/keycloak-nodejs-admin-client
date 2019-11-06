import RoleRepresentation from './roleRepresentation';
export default interface MappingsRepresentation {
    clientMappings?: Record<string, any>;
    realmMappings?: RoleRepresentation[];
}
