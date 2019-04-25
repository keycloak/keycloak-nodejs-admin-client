// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
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
    const realm = await this.kcAdminClient.realms.create({
      id: realmId,
      realm: realmId,
    });
    expect(realm.realmName).to.be.ok;
    this.currentRealmId = realmId;
  });

  after(async () => {
    await this.kcAdminClient.realms.del({realm: this.currentRealmId});
  });

  it('add a user to another realm', async () => {
    const username = faker.internet.userName().toLowerCase();
    const user = await this.kcAdminClient.users.create({
      realm: this.currentRealmId,
      username,
      email: 'wwwy3y3@canner.io',
      // enabled required to be true in order to send actions email
      emailVerified: true,
      enabled: true,
    });
    const foundUser = await this.kcAdminClient.users.findOne({
      realm: this.currentRealmId,
      id: user.id,
    });
    expect(foundUser.username).to.be.eql(username);
  });
});
