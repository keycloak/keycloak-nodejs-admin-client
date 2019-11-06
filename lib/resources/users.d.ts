import Resource from './resource';
import UserRepresentation from '../defs/userRepresentation';
import UserConsentRepresentation from '../defs/userConsentRepresentation';
import UserSessionRepresentation from '../defs/userSessionRepresentation';
import { Agent } from './agent';
import MappingsRepresentation from '../defs/mappingsRepresentation';
import RoleRepresentation, { RoleMappingPayload } from '../defs/roleRepresentation';
import { RequiredActionAlias } from '../defs/requiredActionProviderRepresentation';
import FederatedIdentityRepresentation from '../defs/federatedIdentityRepresentation';
import GroupRepresentation from '../defs/groupRepresentation';
import CredentialRepresentation from '../defs/credentialRepresentation';
export interface UserQuery {
    email?: string;
    first?: number;
    firstName?: string;
    lastName?: string;
    max?: number;
    search?: string;
    username?: string;
}
export declare class Users extends Resource<{
    realm?: string;
}> {
    find: (payload?: UserQuery & {
        realm?: string;
    }) => Promise<UserRepresentation[]>;
    create: (payload?: UserRepresentation & {
        realm?: string;
    }) => Promise<{
        id: string;
    }>;
    findOne: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<UserRepresentation>;
    update: (query: {
        id: string;
    } & {
        realm?: string;
    }, payload: UserRepresentation) => Promise<void>;
    del: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
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
    listCompositeRealmRoleMappings: (payload?: {
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
    executeActionsEmail: (payload?: {
        id: string;
        clientId?: string;
        lifespan?: number;
        redirectUri?: string;
        actions?: RequiredActionAlias[];
    } & {
        realm?: string;
    }) => Promise<void>;
    listGroups: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<GroupRepresentation[]>;
    addToGroup: (payload?: {
        id: string;
        groupId: string;
    } & {
        realm?: string;
    }) => Promise<GroupRepresentation[]>;
    delFromGroup: (payload?: {
        id: string;
        groupId: string;
    } & {
        realm?: string;
    }) => Promise<GroupRepresentation[]>;
    listFederatedIdentities: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<FederatedIdentityRepresentation[]>;
    addToFederatedIdentity: (payload?: {
        id: string;
        federatedIdentityId: string;
        federatedIdentity: FederatedIdentityRepresentation;
    } & {
        realm?: string;
    }) => Promise<void>;
    delFromFederatedIdentity: (payload?: {
        id: string;
        federatedIdentityId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    removeTotp: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    resetPassword: (payload?: {
        id: string;
        credential: CredentialRepresentation;
    } & {
        realm?: string;
    }) => Promise<void>;
    sendVerifyEmail: (payload?: {
        id: string;
        clientId?: string;
        redirectUri?: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listSessions: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<UserSessionRepresentation[]>;
    listOfflineSessions: (payload?: {
        id: string;
        clientId: string;
    } & {
        realm?: string;
    }) => Promise<UserSessionRepresentation[]>;
    logout: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    listConsents: (payload?: {
        id: string;
    } & {
        realm?: string;
    }) => Promise<UserConsentRepresentation[]>;
    revokeConsent: (payload?: {
        id: string;
        clientId: string;
    } & {
        realm?: string;
    }) => Promise<void>;
    constructor(agent: Agent, basePath?: string);
}
