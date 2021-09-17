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

   const createdClientProfile = await kcAdminClient.clientPolicies.updateProfiles(
     newClientProfiles,
   );
   
   expect(createdClientProfile).to.be.deep.eq('');
  });

  it('lists client policy policies', async () => {
    const policies = await kcAdminClient.clientPolicies.listPolicies();
    expect(policies).to.be.ok;
  });

  it('create client policy policy', async () => {
    const newClientPolicy = {
      "policies": [{name: "test", enabled: true, profiles: [], conditions: [], description: "test"}]
    }

   const createdClientPolicy = await kcAdminClient.clientPolicies.updatePolicies(
     newClientPolicy,
   );
   
   expect(createdClientPolicy).to.be.deep.eq('');
  });
});
