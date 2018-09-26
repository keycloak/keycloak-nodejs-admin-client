// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentRealmId?: string;
  }
}

describe('Realms', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);

    const realmId = faker.internet.userName();
    await this.kcAdminClient.realms.create({
      id: realmId,
      realm: realmId
    });
    this.currentRealmId = realmId;
  });

  after(async () => {
    await this.kcAdminClient.realms.del({realm: this.currentRealmId});
  });

  it('add a user to another realm', async () => {
    const username = faker.internet.userName().toLowerCase();
    await this.kcAdminClient.users.create({
      realm: this.currentRealmId,
      username,
      email: 'wwwy3y3@canner.io',
      // enabled required to be true in order to send actions email
      emailVerified: true,
      enabled: true
    });
    const users = await this.kcAdminClient.users.find({
      realm: this.currentRealmId,
      username
    });
    expect(users[0].username).to.be.eql(username);
  });
});
