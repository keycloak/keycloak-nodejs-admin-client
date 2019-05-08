export default interface EventRepresentation {
    cllientId?: string;
    details?: Record<string, any>;
    error?: string;
    ipAddress?: string;
    realmId?: string;
    sessionId?: string;
    time?: number;
    type?: string;
    userId?: string;
}
