export default interface CredentialRepresentation {
    algorithm?: string;
    config?: Record<string, any>;
    counter?: number;
    createdDate?: number;
    device?: string;
    digits?: number;
    hashIterations?: number;
    hashedSaltedValue?: string;
    period?: number;
    salt?: string;
    temporary?: boolean;
    type?: string;
    value?: string;
}
