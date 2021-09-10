// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';

const expect = chai.expect;

describe('Client Policies', () => {
  let kcAdminClient: KeycloakAdminClient;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
  });

  it('lists client policy profiles', async () => {
    const profiles = await kcAdminClient.clientPolicies.listProfiles();
    expect(profiles).to.be.ok;
  });
});
