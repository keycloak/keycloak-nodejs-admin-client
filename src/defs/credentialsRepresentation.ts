[{"id":"c072522e-1a5a-4037-b8a9-aa8d94cda9f9","type":"otp","userLabel":"wfawf","createdDate":1623976183167,"credentialData":"{\"subType\":\"totp\",\"digits\":6,\"counter\":0,\"period\":30,\"algorithm\":\"HmacSHA1\"}"}]

export type CredentialType = 'otp';

 export default interface CredentialRepresentation {
  id?: string;
  type?: CredentialType;
  userLabel?: string;
  createdDate?: number;
  credentialData?: string;
}
