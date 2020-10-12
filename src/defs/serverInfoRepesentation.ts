import ComponentTypeRepresentation from './componentTypeRepresentation';
import {ConfigPropertyRepresentation} from './configPropertyRepresentation';
import PasswordPolicyTypeRepresentation from './passwordPolicyTypeRepresentation';
import ProfileInfoRepresentation from './profileInfoRepresentation';
import ProtocolMapperRepresentation from './protocolMapperRepresentation';
import SystemInfoRepresentation from './systemInfoRepersantation';

/**
 * https://www.keycloak.org/docs-api/11.0/rest-api/index.html#_serverinforepresentation
 */
export interface ServerInfoRepresentation {
  systemInfo?: SystemInfoRepresentation;
  memoryInfo?: MemoryInfoRepresentation;
  profileInfo?: ProfileInfoRepresentation;
  themes?: {[index: string]: ThemeInfoRepresentation[]};
  socialProviders?: Array<{[index: string]: string}>;
  identityProviders?: Array<{[index: string]: string}>;
  clientImporters?: Array<{[index: string]: string}>;
  providers?: {[index: string]: SpiInfoRepresentation};
  protocolMapperTypes?: {[index: string]: ProtocolMapperTypeRepresentation[]};
  builtinProtocolMappers?: {[index: string]: ProtocolMapperRepresentation[]};
  clientInstallations?: {[index: string]: ClientInstallationRepresentation[]};
  componentTypes?: {[index: string]: ComponentTypeRepresentation[]};
  passwordPolicies?: PasswordPolicyTypeRepresentation[];
  enums?: {[index: string]: string[]};
}

export interface ThemeInfoRepresentation {
  name: string;
  locales: string[];
}

export interface SpiInfoRepresentation {
  internal: boolean;
  providers: {[index: string]: ProviderRepresentation};
}

export interface ProviderRepresentation {
  order: number;
  operationalInfo: {[index: string]: string};
}

export interface ClientInstallationRepresentation {
  id: string;
  protocol: string;
  downloadOnly: boolean;
  displayType: string;
  helpText: string;
  filename: string;
  mediaType: string;
}

export interface MemoryInfoRepresentation {
  total: number;
  totalFormated: string;
  used: number;
  usedFormated: string;
  free: number;
  freePercentage: number;
  freeFormated: string;
}

export interface ProtocolMapperTypeRepresentation {
  id: string;
  name: string;
  category: string;
  helpText: string;
  priority: number;
  properties: ConfigPropertyRepresentation[];
}
