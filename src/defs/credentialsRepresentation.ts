export type CredentialType = 'otp';

 export default interface CredentialRepresentation {
  id?: string;
  type?: CredentialType;
  userLabel?: string;
  createdDate?: number;
  credentialData?: string;
}
