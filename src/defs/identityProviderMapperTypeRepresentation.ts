import {ConfigPropertyRepresentation} from './configPropertyRepresentation';

export interface IdentityProviderMapperTypeRepresentation {
  id?: string;
  name?: string;
  category?: string;
  helpText?: string;
  properties?: ConfigPropertyRepresentation[];
}
