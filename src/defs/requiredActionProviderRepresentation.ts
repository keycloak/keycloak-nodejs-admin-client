/**
 * https://www.keycloak.org/docs-api/4.1/rest-api/#_requiredactionproviderrepresentation
 */

export enum RequiredActionAlias {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  CONFIGURE_TOTP = 'CONFIGURE_TOTP',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  terms_and_conditions = 'terms_and_conditions'
}

export default interface RequiredActionProviderRepresentation {
  alias?: string;
  config?: Record<string, any>;
  defaultAction?: boolean;
  enabled?: boolean;
  name?: string;
  provider?: string;
}
