// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
const expect = chai.expect;

describe('Realms', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentRealmId: string;
  let currentRealmName: string;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
  });

  it('list realms', async () => {
    const realms = await kcAdminClient.realms.find();
    expect(realms.length).to.be.least(1);
  });

  it('create realm', async () => {
    const realmId = faker.internet.userName().toLowerCase();
    const realmName = faker.internet.userName().toLowerCase();
    const realm = await kcAdminClient.realms.create({
      id: realmId,
      realm: realmName,
    });
    expect(realm.realmName).to.be.equal(realmName);
    currentRealmId = realmId;
    currentRealmName = realmName;
  });

  it('get a realm', async () => {
    const realm = await kcAdminClient.realms.findOne({
      realm: currentRealmName,
    });
    expect(realm).to.include({
      id: currentRealmId,
      realm: currentRealmName,
    });
  });

  it('update a realm', async () => {
    await kcAdminClient.realms.update(
      {realm: currentRealmName},
      {
        displayName: 'test',
      },
    );
    const realm = await kcAdminClient.realms.findOne({
      realm: currentRealmName,
    });
    expect(realm).to.include({
      id: currentRealmId,
      realm: currentRealmName,
      displayName: 'test',
    });
  });

  it('delete a realm', async () => {
    await kcAdminClient.realms.del({realm: currentRealmName});
    const realm = await kcAdminClient.realms.findOne({
      realm: currentRealmName,
    });
    expect(realm).to.be.null;
  });

  describe('Realm Events', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      const realmId = faker.internet.userName().toLowerCase();
      const realmName = faker.internet.userName().toLowerCase();
      const realm = await kcAdminClient.realms.create({
        id: realmId,
        realm: realmName,
      });
      expect(realm.realmName).to.be.equal(realmName);
      currentRealmId = realmId;
      currentRealmName = realmName;
    });

    it('list events of a realm', async () => {
      // @TODO: In order to test it, there have to be events
      const events = await kcAdminClient.realms.findEvents({
        realm: currentRealmName,
      });

      expect(events).to.be.ok;
    });

    after(async () => {
      await kcAdminClient.realms.del({realm: currentRealmName});
      const realm = await kcAdminClient.realms.findOne({
        realm: currentRealmName,
      });
      expect(realm).to.be.null;
    });
  });
  
  describe('Realm Admin Events', function() {
    before(async () => {
      this.kcAdminClient = new KeycloakAdminClient();
      await this.kcAdminClient.auth(credentials);

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

    it('list events of a realm', async () => {
      // @TODO: In order to test it, there have to be events
      const events = await this.kcAdminClient.realms.findAdminEvents({
        realm: this.currentRealmName,
      });

      expect(events).to.be.ok;
    });

    after(async () => {
      await this.kcAdminClient.realms.del({realm: this.currentRealmName});
      const realm = await this.kcAdminClient.realms.findOne({
        realm: this.currentRealmName,
      });
      expect(realm).to.be.null;
    });
  });

  describe('Realm Users Management Permissions', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      const realmId = faker.internet.userName().toLowerCase();
      const realmName = faker.internet.userName().toLowerCase();
      const realm = await kcAdminClient.realms.create({
        id: realmId,
        realm: realmName,
      });
      expect(realm.realmName).to.be.equal(realmName);
      currentRealmId = realmId;
      currentRealmName = realmName;
    });

    it('get users management permissions', async () => {
      const managementPermissions = await kcAdminClient.realms.getUsersManagementPermissions(
        {
          realm: currentRealmName,
        },
      );
      expect(managementPermissions).to.be.ok;
    });

    it('enable users management permissions', async () => {
      const managementPermissions = await kcAdminClient.realms.updateUsersManagementPermissions(
        {
          realm: currentRealmName,
          enabled: true,
        },
      );
      expect(managementPermissions).to.include({enabled: true});
    });

    after(async () => {
      await kcAdminClient.realms.del({realm: currentRealmName});
      const realm = await kcAdminClient.realms.findOne({
        realm: currentRealmName,
      });
      expect(realm).to.be.null;
    });
  });
});
