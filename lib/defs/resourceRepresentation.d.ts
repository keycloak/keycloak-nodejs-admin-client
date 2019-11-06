import ScopeRepresentation from './scopeRepresentation';
export default interface ResourceRepresentation {
    id?: string;
    attributes?: Record<string, any>;
    displayName?: string;
    icon_uri?: string;
    name?: string;
    ownerManagedAccess?: boolean;
    scopes?: ScopeRepresentation[];
    type?: string;
    uri?: string;
}
