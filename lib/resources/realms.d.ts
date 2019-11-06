import Resource from './resource';
import RealmRepresentation from '../defs/realmRepresentation';
import EventRepresentation from '../defs/eventRepresentation';
import EventType from '../defs/eventTypes';
import { Agent } from './agent';
export declare class Realms extends Resource {
    find: (payload?: void & {}) => Promise<RealmRepresentation[]>;
    create: (payload?: RealmRepresentation) => Promise<{
        realmName: string;
    }>;
    findOne: (payload?: {
        realm: string;
    }) => Promise<RealmRepresentation>;
    update: (query: {
        realm: string;
    }, payload: RealmRepresentation) => Promise<void>;
    del: (payload?: {
        realm: string;
    }) => Promise<void>;
    findEvents: (payload?: {
        realm: string;
        client?: string;
        dateFrom?: Date;
        dateTo?: Date;
        first?: number;
        ipAddress?: string;
        max?: number;
        type?: EventType;
        user?: string;
    }) => Promise<EventRepresentation[]>;
    constructor(agent: Agent, basePath?: string);
}
