import Resource from './resource';
import RoleRepresentation from '../defs/roleRepresentation';
import UserRepresentation from '../defs/userRepresentation';
import { Agent } from './agent';
export declare class Roles extends Resource<{
    realm?: string;
}> {
    find: (payload?: void & {
        realm?: string;
    }) => Promise<RoleRepresentation[]>;
    create: (payload?: RoleRepresentation & {
        realm?: string;
    }) => Promise<{
        roleName: string;
    }>;
    findOneByName: (payload?: {
        name: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation>;
    updateByName: (query: {
        name: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation) => Promise<void>;
    delByName: (payload?: {
        name: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findUsersWithRole: (payload?: {
        name: string;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    findOneById: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<RoleRepresentation>;
    updateById: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: RoleRepresentation) => Promise<void>;
    delById: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    constructor(agent: Agent, basePath?: string);
}
