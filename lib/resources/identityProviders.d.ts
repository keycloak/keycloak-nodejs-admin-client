import Resource from './resource';
import IdentityProviderRepresentation from '../defs/identityProviderRepresentation';
import IdentityProviderMapperRepresentation from '../defs/identityProviderMapperRepresentation';
import { Agent } from './agent';
export declare class IdentityProviders extends Resource<{
    realm?: string;
}> {
    find: (payload?: void & {
        realm?: string;
    }) => Promise<IdentityProviderRepresentation[]>;
    create: (payload?: IdentityProviderRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        alias: string;
    } & {
        realm?: string;
    }) => Promise<IdentityProviderRepresentation>;
    update: (query: {
        alias: string;
    } & {
        realm?: string;
    }, payload: IdentityProviderRepresentation) => Promise<void>;
    del: (payload?: {
        alias: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findFactory: (payload?: {
        providerId: string;
    } & {
        realm?: string;
    }) => Promise<any>;
    findMappers: (payload?: {
        alias: string;
    } & {
        realm?: string;
    }) => Promise<IdentityProviderMapperRepresentation[]>;
    findOneMapper: (payload?: {
        alias: string;
        id: string;
    } & {
        realm?: string;
    }) => Promise<IdentityProviderMapperRepresentation>;
    createMapper: (payload?: {
        alias: string;
        identityProviderMapper: IdentityProviderMapperRepresentation;
    } & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    updateMapper: (query: {
        alias: string;
        id: string;
    } & {
        realm?: string;
    }, payload: IdentityProviderMapperRepresentation) => Promise<void>;
    delMapper: (payload?: {
        alias: string;
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    findMapperTypes: (payload?: {
        alias: string;
    } & {
        realm?: string;
    }) => Promise<IdentityProviderMapperRepresentation[]>;
    constructor(agent: Agent, basePath?: string);
}
