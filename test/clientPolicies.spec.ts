// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import ClientPolicyRepresentation from '../src/defs/clientPolicyRepresentation';
import {credentials} from './constants';

const expect = chai.expect;

describe('Client Policies', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentClientPolicy: string;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
  });

  it('creates client policy', async () => {
    const newPolicy = await kcAdminClient.clientPolicies.createPolicy({
      name: 'test_client_policy',
    });
    expect(newPolicy).to.be.ok;
  });

  it('lists client policy profiles', async () => {
    const profiles = await kcAdminClient.clientPolicies.listProfiles();
    expect(profiles).to.be.ok;
  });

  it('lists client policy policies', async () => {
    const policies = await kcAdminClient.clientPolicies.listPolicies();
    expect(policies).to.be.ok;
  });

  it('updates client policy', async () => {
    currentClientPolicy = 'test_client_policy';
    const updatedPolicy = await kcAdminClient.clientPolicies.updatePolicy(
      {
        name: currentClientPolicy,
      },
      {
        description: 'This is the updated description.',
      },
    );
    expect(updatedPolicy).to.include({
      description: 'This is the updated description.',
    });
  });
});
