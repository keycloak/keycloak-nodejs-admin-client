export default interface RoleRepresentation {
    clientRole?: boolean;
    composite?: boolean;
    composites?: {
        client: Record<string, any>;
        realm: string[];
    };
    containerId?: string;
    description?: string;
    id?: string;
    name?: string;
}
export interface RoleMappingPayload extends RoleRepresentation {
    id: string;
    name: string;
}
