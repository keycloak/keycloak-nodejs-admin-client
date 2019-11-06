import ClientScopeRepresentation from '../defs/clientScopeRepresentation';
import Resource from './resource';
import { Agent } from './agent';
import ProtocolMapperRepresentation from '../defs/protocolMapperRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation from '../defs/roleRepresentation';
export declare class ClientScopes extends Resource<{
    realm?: string;
}> {
    find: (payload?: {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    create: (payload?: ClientScopeRepresentation & {
        realm?: string;
    }) => Promise<void>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ClientScopeRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listDefaultClientScopes: (payload?: void & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    addDefaultClientScope: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delDefaultClientScope: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listDefaultOptionalClientScopes: (payload?: void & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    addDefaultOptionalClientScope: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delDefaultOptionalClientScope: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    addMultipleProtocolMappers: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ProtocolMapperRepresentation[]) => Promise<void>;
    addProtocolMapper: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ProtocolMapperRepresentation) => Promise<void>;
    listProtocolMappers: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation[]>;
    findProtocolMapper: (payload?: {
        id: string;
        mapperId: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation>;
    findProtocolMappersByProtocol: (payload?: {
        id: string;
        protocol: string;
    } & {
        realm?: string;
    }) => Promise<ProtocolMapperRepresentation[]>;
    updateProtocolMapper: (query: {
        id: string;
        mapperId: string;
    } & {
        realm?: string;
    }, payload: ProtocolMapperRepresentation) => Promise<void>;
    delProtocolMapper: (payload?: {
        id: string;
        mapperId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<MappingsRepresentation>;
    addClientScopeMappings: (query: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    listClientScopeMappings: (payload?: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listAvailableClientScopeMappings: (payload?: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listCompositeClientScopeMappings: (payload?: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delClientScopeMappings: (query: {
        id: string;
        client: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    addRealmScopeMappings: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    listRealmScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listAvailableRealmScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listCompositeRealmScopeMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delRealmScopeMappings: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation[]) => Promise<void>;
    constructor(agent: Agent, basePath?: string);
    findOneByName(payload: {
        realm?: string;
        name: string;
    }): Promise<ClientScopeRepresentation>;
    delByName(payload: {
        realm?: string;
        name: string;
    }): Promise<void>;
    findProtocolMapperByName(payload: {
        realm?: string;
        id: string;
        name: string;
    }): Promise<ProtocolMapperRepresentation>;
}
