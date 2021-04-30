// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
const expect = chai.expect;


const createRealm = async (kcAdminClient: KeycloakAdminClient) => {
  const realmId = faker.internet.userName().toLowerCase();
  const realmName = faker.internet.userName().toLowerCase();
  const realm = await kcAdminClient.realms.create({
    id: realmId,
    realm: realmName,
  });
  expect(realm.realmName).to.be.equal(realmName);

  return {realmId, realmName};
};

const deleteRealm = async (kcAdminClient: KeycloakAdminClient, currentRealmName: string) => {
  await kcAdminClient.realms.del({realm: currentRealmName});
  const realm = await kcAdminClient.realms.findOne({
    realm: currentRealmName,
  });
  expect(realm).to.be.null;
};

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

  it('export a realm', async () => {
    const realm = await kcAdminClient.realms.export({
      realm: currentRealmName,
      exportClients: true,
      exportGroupsAndRoles: true,
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

  describe('Realm Client Initial Access', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      const created = await createRealm(kcAdminClient);
      currentRealmName = created.realmName;

      await kcAdminClient.realms.createClientsInitialAccess({realm: currentRealmName}, {count: 1, expiration: 0});
    });

    after(async () => {
      deleteRealm(kcAdminClient, currentRealmName);
    });

    it('list client initial access', async () => {
      const initialAccess = await kcAdminClient.realms.getClientsInitialAccess({realm: currentRealmName});
      expect(initialAccess).to.be.ok;
      expect(initialAccess[0].count).to.be.eq(1);
    });

    it('del client initial access', async () => {
      const access = await kcAdminClient.realms.createClientsInitialAccess({realm: currentRealmName}, {count: 1, expiration: 0});
      expect((await kcAdminClient.realms.getClientsInitialAccess({realm: currentRealmName})).length).to.be.eq(2);

      await kcAdminClient.realms.delClientsInitialAccess({realm: currentRealmName, id: access.id!});

      const initialAccess = await kcAdminClient.realms.getClientsInitialAccess({realm: currentRealmName});
      expect(initialAccess).to.be.ok;
      expect(initialAccess[0].count).to.be.eq(1);
    });

  });

  describe('Realm Events', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      const created = await createRealm(kcAdminClient);
      currentRealmId = created.realmId;
      currentRealmName = created.realmName;
    });

    it('list events of a realm', async () => {
      // @TODO: In order to test it, there have to be events
      const events = await kcAdminClient.realms.findEvents({
        realm: currentRealmName,
      });

      expect(events).to.be.ok;
    });

    it('list admin events of a realm', async () => {
      // @TODO: In order to test it, there have to be events
      const events = await kcAdminClient.realms.findAdminEvents({
        realm: currentRealmName,
      });

      expect(events).to.be.ok;
    });

    after(async () => {
      deleteRealm(kcAdminClient, currentRealmName);
    });
  });

  describe('Realm Users Management Permissions', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      const created = await createRealm(kcAdminClient);
      currentRealmId = created.realmId;
      currentRealmName = created.realmName;
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

    it('get realm keys', async () => {
      const keys = await kcAdminClient.realms.getKeys({realm: currentRealmName});
      expect(keys.active).to.be.ok;
    });

    after(async () => {
      deleteRealm(kcAdminClient, currentRealmName);
    });
  });

  describe('Realm Session Management', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      const created = await createRealm(kcAdminClient);
      currentRealmId = created.realmId;
      currentRealmName = created.realmName;
    });

    it('log outs all sessions', async () => {
      const logout = await kcAdminClient.realms.logoutAll({
        realm: currentRealmName,
      });
      expect(logout).to.be.ok;
    });

    after(async () => {
      deleteRealm(kcAdminClient, currentRealmName);
    });
  });

  describe('Realm test ldap settings', () => {
    it('should fail with invalid ldap settings', async () => {
      try {
        await kcAdminClient.realms.testLDAPConnection({realm: 'master'}, {
          action: 'testConnection',
          authType: 'simple',
          bindCredential: '1',
          bindDn: '1',
          connectionTimeout: '',
          connectionUrl: '1',
          startTls: '',
          useTruststoreSpi: 'ldapsOnly',
        });
      } catch (error) {
        expect(error).to.be.ok;
        expect(error.response?.data?.errorMessage).to.eq('LDAP test error');
      }
    });
  });
});
