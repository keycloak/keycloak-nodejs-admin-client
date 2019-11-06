import Resource from './resource';
import ClientRepresentation from '../defs/clientRepresentation';
import { Agent } from './agent';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import CredentialRepresentation from '../defs/credentialRepresentation';
import ClientScopeRepresentation from '../defs/clientScopeRepresentation';
import ProtocolMapperRepresentation from '../defs/protocolMapperRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
export interface ClientQuery {
    clientId?: string;
    viewableOnly?: boolean;
}
export declare class Clients extends Resource<{
    realm?: string;
}> {
    find: (payload?: ClientQuery & {
        realm?: string;
    }) => Promise<ClientRepresentation[]>;
    create: (payload?: ClientRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ClientRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    createRole: (payload?: RoleRepresentation & {
        realm?: string;
    }) => Promise<{
        roleName: string;
    }>;
    listRoles: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    findRole: (payload?: {
        id: string;
        roleName: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation>;
    updateRole: (query: {
        id: string;
        roleName: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation) => Promise<void>;
    delRole: (payload?: {
        id: string;
        roleName: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findUsersWithRole: (payload?: {
        id: string;
        roleName: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    getServiceAccountUser: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation>;
    generateNewClientSecret: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    getClientSecret: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<CredentialRepresentation>;
    listDefaultClientScopes: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    addDefaultClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delDefaultClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listOptionalClientScopes: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ClientScopeRepresentation[]>;
    addOptionalClientScope: (payload?: {
        id: string;
        clientScopeId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    delOptionalClientScope: (payload?: {
        id: string;
        clientScopeId: string;
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
    findProtocolMapperById: (payload?: {
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
    findProtocolMapperByName(payload: {
        realm?: string;
        id: string;
        name: string;
    }): Promise<ProtocolMapperRepresentation>;
}
