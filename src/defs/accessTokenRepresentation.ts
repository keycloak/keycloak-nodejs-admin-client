import AddressClaimSet from './addressClaimSet';
import {Category} from './resourceServerRepresentation';

export default interface AccessTokenRepresentation {
  acr?: string;
  address?: AddressClaimSet;
  'allowed-origins'?: string[];
  at_hash?: string;
  auth_time?: number;
  authorization?: {
    permissions: {
      claims?: {[index: string]: string};
      rsid?: string;
      rsname?: string;
      scopes?: string[];
    }[];
  };
  azp?: string;
  birthdate?: string;
  c_hash?: string;
  category?: Category;
  claims_locales?: string;
  cnf?: {
    'x5t#S256'?: string;
  };
  email?: string;
  email_verified?: boolean;
  exp?: number;
  family_name?: string;
  gender: string;
  given_name?: string;
  iat?: number;
  iss?: string;
  jti?: string;
  locale?: string;
  middle_name?: string;
  name?: string;
  nbf?: number;
  nickname?: string;
  nonce?: string;
  otherClaims?: {[index: string]: string};
  phone_number?: string;
  phone_number_verified?: boolean;
  picture?: string;
  preferred_username?: string;
  profile?: string;
  realm_access?: {
    roles?: string[];
    verify_caller?: boolean;
  };
  s_hash?: string;
  scope?: string;
  session_state?: string;
  sub?: string;
  'trusted-certs'?: string[];
  typ?: string;
  updated_at?: number;
  website?: string;
  zoneinfo?: string;
}
