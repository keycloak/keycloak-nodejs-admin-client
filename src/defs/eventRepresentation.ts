import EventType from './eventTypes';

export default interface EventRepresentation {
    cllientId?: string;
    details?: Record<string, any>;
    error?: string;
    ipAddress?: string;
    realmId?: string;
    sessionId?: string;
    time?: number;
    type?: EventType;
    userId?: string;
}
