import Resource from './resource';
import GroupRepresentation from '../defs/groupRepresentation';
import { Agent } from './agent';
import UserRepresentation from '../defs/userRepresentation';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, { RoleMappingPayload } from '../defs/roleRepresentation';
export interface GroupQuery {
    first?: number;
    max?: number;
    search?: string;
}
export declare class Groups extends Resource<{
    realm?: string;
}> {
    find: (payload?: GroupQuery & {
        realm?: string;
    }) => Promise<GroupRepresentation[]>;
    create: (payload?: GroupRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<GroupRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: GroupRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    setOrCreateChild: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: GroupRepresentation) => Promise<{
        id: string;
    }>;
    listMembers: (payload?: {
        id: string;
        first?: number;
        max?: number;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    listRoleMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<MappingsRepresentation>;
    addRealmRoleMappings: (payload?: {
        id: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listRealmRoleMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    delRealmRoleMappings: (payload?: {
        id: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listAvailableRealmRoleMappings: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    listClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    addClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    delClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
        roles: RoleMappingPayload[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listAvailableClientRoleMappings: (payload?: {
        id: string;
        clientUniqueId: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    constructor(agent: Agent, basePath?: string);
}
