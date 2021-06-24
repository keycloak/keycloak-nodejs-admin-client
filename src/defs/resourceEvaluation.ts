import ResourceRepresentation from './resourceRepresentation';

export default interface ResourceEvaluation {
  rolesIds?: string[];
  userId: string;
  resources?: ResourceRepresentation[];
  entitlements: boolean;
  context: {
    attributes: {
      [key: string]: string;
    };
  };
}
