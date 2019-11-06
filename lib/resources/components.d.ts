import Resource from './resource';
import ComponentRepresentation from '../defs/componentRepresentation';
import { Agent } from './agent';
export interface ComponentQuery {
    name?: string;
    parent?: string;
    type?: string;
}
export declare class Components extends Resource<{
    realm?: string;
}> {
    find: (payload?: ComponentQuery & {
        realm?: string;
    }) => Promise<ComponentRepresentation[]>;
    create: (payload?: ComponentRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<ComponentRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: ComponentRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    constructor(agent: Agent, basePath?: string);
}
