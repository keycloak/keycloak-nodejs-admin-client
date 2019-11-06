export declare enum RequiredActionAlias {
    VERIFY_EMAIL = "VERIFY_EMAIL",
    UPDATE_PROFILE = "UPDATE_PROFILE",
    CONFIGURE_TOTP = "CONFIGURE_TOTP",
    UPDATE_PASSWORD = "UPDATE_PASSWORD",
    terms_and_conditions = "terms_and_conditions"
}
export default interface RequiredActionProviderRepresentation {
    alias?: string;
    config?: Record<string, any>;
    defaultAction?: boolean;
    enabled?: boolean;
    name?: string;
    provider?: string;
}
