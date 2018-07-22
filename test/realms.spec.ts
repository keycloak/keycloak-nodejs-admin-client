// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
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
    await this.kcAdminClient.auth(cred);
  });

  it('list realms', async () => {
    const realms = await this.kcAdminClient.realms.find();
    expect(realms.length).to.be.least(1);
  });

  it('create realm', async () => {
    const realmId = faker.internet.userName();
    await this.kcAdminClient.realms.create({
      id: realmId,
      realm: realmId
    });
    this.currentRealmId = realmId;
  });

  it('get a realm', async () => {
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealmId
    });
    expect(realm).to.include({
      id: this.currentRealmId,
      realm: this.currentRealmId
    });
  });

  it('update a realm', async () => {
    await this.kcAdminClient.realms.update({realm: this.currentRealmId}, {
      displayName: 'test'
    });
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealmId
    });
    expect(realm).to.include({
      id: this.currentRealmId,
      realm: this.currentRealmId,
      displayName: 'test'
    });
  });

  it('delete a realm', async () => {
    await this.kcAdminClient.realms.del({realm: this.currentRealmId});
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealmId
    });
    expect(realm).to.be.null;
  });
});
