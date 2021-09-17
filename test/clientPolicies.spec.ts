// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import ClientPolicyRepresentation from '../src/defs/clientPolicyRepresentation';
import {credentials} from './constants';

const expect = chai.expect;

describe('Client Policies', () => {
  let kcAdminClient: KeycloakAdminClient;
  const newPolicy = {
    name: 'new_test_policy',
  };

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
  });

  it('creates client policy', async () => {
    const createdPolicy = await kcAdminClient.clientPolicies.createPolicy({
      policies: [newPolicy],
    });
    expect(createdPolicy).to.be.ok;
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
    const policyWithUpdatedDescription = {
      name: 'new_test_policy',
      description: 'This is the updated description.',
    };
    const updatedPolicy = await kcAdminClient.clientPolicies.updatePolicy(
      {
        policies: [newPolicy],
      },
      {
        policies: [policyWithUpdatedDescription],
      },
    );
    expect(updatedPolicy).to.include({
      description: 'This is the updated description.',
    });
  });
});
