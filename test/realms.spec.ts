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
    currentRealmName?: string;
  }
}

describe('Realms', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);
  });

  it('list realms', async () => {
    const realms = await this.kcAdminClient.realms.find();
    expect(realms.length).to.be.least(1);
  });

  it('create realm', async () => {
    const realmId = faker.internet.userName().toLowerCase();
    const realmName = faker.internet.userName().toLowerCase();
    const realm = await this.kcAdminClient.realms.create({
      id: realmId,
      realm: realmName,
    });
    expect(realm.realmName).to.be.equal(realmName);
    this.currentRealmId = realmId;
    this.currentRealmName = realmName;
  });

  it('get a realm', async () => {
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealmName,
    });
    expect(realm).to.include({
      id: this.currentRealmId,
      realm: this.currentRealmName,
    });
  });

  it('update a realm', async () => {
    await this.kcAdminClient.realms.update(
      {realm: this.currentRealmName},
      {
        displayName: 'test',
      },
    );
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealmName,
    });
    expect(realm).to.include({
      id: this.currentRealmId,
      realm: this.currentRealmName,
      displayName: 'test',
    });
  });

  it('delete a realm', async () => {
    await this.kcAdminClient.realms.del({realm: this.currentRealmName});
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealmName,
    });
    expect(realm).to.be.null;
  });
});
