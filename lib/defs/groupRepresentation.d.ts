export default interface GroupRepresentation {
    id?: string;
    name?: string;
    path?: string;
    subGroups?: GroupRepresentation[];
    access?: Record<string, boolean>;
    attributes?: Record<string, any>;
    clientRoles?: Record<string, any>;
    realmRoles?: string[];
}
