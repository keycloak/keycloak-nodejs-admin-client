import { Credentials } from './utils/auth';
import { Agent } from './resources/agent';
import { Users } from './resources/users';
import { Groups } from './resources/groups';
import { Roles } from './resources/roles';
import { Clients } from './resources/clients';
import { Realms } from './resources/realms';
import { ClientScopes } from './resources/clientScopes';
import { IdentityProviders } from './resources/identityProviders';
import { Components } from './resources/components';
import { AxiosRequestConfig } from 'axios';
export interface ConnectionConfig {
    baseUrl?: string;
    realmName?: string;
    requestConfig?: AxiosRequestConfig;
}
export declare class KeycloakAdminClient {
    users: Users;
    groups: Groups;
    roles: Roles;
    clients: Clients;
    realms: Realms;
    clientScopes: ClientScopes;
    identityProviders: IdentityProviders;
    components: Components;
    baseUrl: string;
    realmName: string;
    accessToken: string;
    refreshToken: string;
    private requestConfig?;
    constructor(connectionConfig?: ConnectionConfig, agentInjection?: Agent);
    auth(credentials: Credentials): Promise<void>;
    setAccessToken(token: string): void;
    getAccessToken(): string;
    getRequestConfig(): AxiosRequestConfig;
    setConfig(connectionConfig: ConnectionConfig): void;
}
