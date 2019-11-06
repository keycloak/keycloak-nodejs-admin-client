import PolicyRepresentation from './policyRepresentation';
import ResourceRepresentation from './resourceRepresentation';
export default interface ScopeRepresentation {
    displayName?: string;
    iconUri?: string;
    id?: string;
    name?: string;
    policies?: PolicyRepresentation[];
    resources?: ResourceRepresentation[];
}
