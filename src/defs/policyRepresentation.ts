/**
 * https://www.keycloak.org/docs-api/18.0/rest-api/index.html#_policyrepresentation
 */

export enum DecisionStrategy {
  AFFIRMATIVE = 'AFFIRMATIVE',
  UNANIMOUS = 'UNANIMOUS',
  CONSENSUS = 'CONSENSUS',
}

export enum DecisionEffect {
  Permit = 'PERMIT',
  Deny = 'DENY',
}

export enum Logic {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
}

export enum PolicyType {
  GROUP = 'group',
  ROLE = 'role',
}

export interface PolicyBaseRepresentation {
  decisionStrategy: DecisionStrategy;
  description: string;
  id: string;
  logic: Logic;
  name: string;
  type: PolicyType;
}

interface PolicyGroupRepresentationItem {
  id: string;
  path: string;
}

interface PolicyRoleRepresentationItem {
  id: string;
  required: boolean;
}

export type PolicyGroupRepresentation = PolicyBaseRepresentation & {
  groups: PolicyGroupRepresentationItem[];
  roles: never;
}

export type PolicyRoleRepresentation = PolicyBaseRepresentation & {
  groups: never;
  roles: PolicyRoleRepresentationItem[];
}

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;
type DeepPartialWithOmit<T, R extends string> = T extends object ? {
  [P in keyof Omit<T, R>]?: DeepPartial<T[P]>;
} : T;

type PolicyRepresentation = PolicyGroupRepresentation | PolicyRoleRepresentation;

export type CreatePolicyRepresentationInput = DeepPartialWithOmit<CreatePolicyGroupRepresentationInput | CreatePolicyRoleRepresentationInput, "id">;
export type CreatePolicyGroupRepresentationInput = DeepPartialWithOmit<PolicyGroupRepresentation, "id">;
export type CreatePolicyRoleRepresentationInput = DeepPartialWithOmit<PolicyRoleRepresentation, "id">;

export type UpdatePolicyRepresentationInput = DeepPartialWithOmit<CreatePolicyGroupRepresentationInput | CreatePolicyRoleRepresentationInput, "id"> & Pick<CreatePolicyGroupRepresentationInput | CreatePolicyRoleRepresentationInput, "id">;
export type UpdatePolicyGroupRepresentationInput = DeepPartialWithOmit<PolicyGroupRepresentation, "id"> & Pick<PolicyGroupRepresentation, "id">;
export type UpdatePolicyRoleRepresentationInput = DeepPartialWithOmit<PolicyRoleRepresentation, "id"> & Pick<PolicyRoleRepresentation, "id">;

export default CreatePolicyRepresentationInput;
