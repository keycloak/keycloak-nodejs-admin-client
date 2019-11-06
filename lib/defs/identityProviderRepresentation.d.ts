export default interface IdentityProviderRepresentation {
    addReadTokenRoleOnCreate?: boolean;
    alias?: string;
    config?: Record<string, any>;
    displayName?: string;
    enabled?: boolean;
    firstBrokerLoginFlowAlias?: string;
    internalId?: string;
    linkOnly?: boolean;
    postBrokerLoginFlowAlias?: string;
    providerId?: string;
    storeToken?: boolean;
    trustEmail?: boolean;
}
