// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import ClientProfilesRepresentation from '../src/defs/clientProfilesRepresentation';
import {credentials} from './constants';

const expect = chai.expect;

describe('Client Policies', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentClientProfiles: ClientProfilesRepresentation;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
  });

  it('lists client policy profiles', async () => {
    const profiles = await kcAdminClient.clientPolicies.listProfiles(
      {includeGlobalProfiles: true},
    );
    expect(profiles).to.be.ok;
    currentClientProfiles = profiles;
  });

  it('create client policy profiles', async () => {
    const globalProfiles = currentClientProfiles.globalProfiles;
    const newClientProfiles = {
      "profiles": [
        {
          "name": "test",
          "executors": []
        }
    ], globalProfiles }

   const createdClientProfile = await kcAdminClient.clientPolicies.createProfiles(
     newClientProfiles,
   );
   
   expect(createdClientProfile).to.be.deep.eq('');
  });

  it('lists client policy policies', async () => {
    const policies = await kcAdminClient.clientPolicies.listPolicies();
    expect(policies).to.be.ok;
  });
});
