import PolicyRepresentation from './policyRepresentation';

export default interface ResourcePermissionRepresentation extends PolicyRepresentation {
    resourceType?: string;
}
