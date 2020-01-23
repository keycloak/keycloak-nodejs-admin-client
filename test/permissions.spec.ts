// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import ClientRepresentation from '../src/defs/clientRepresentation';
import {DecisionStrategy, Logic} from '../src/defs/policyRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';
const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentRealm?: string;
    currentClient?: ClientRepresentation;
    currentGroup?: GroupRepresentation;
    permissionId?: string;
    policyId?: string;
  }
}

describe('authorization permissions and policies for realm management', () => {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);

    const realmName = faker.internet.userName().toLowerCase();
    await this.kcAdminClient.realms.create({
      id: realmName,
      realm: realmName,
      enabled: true,
    });
    this.currentRealm = realmName;

    // enable user management permissions
    await this.kcAdminClient.realms.updateUserManagementPermissions({
      realm: realmName,
      enabled: true,
    });

    // find realm-management client
    const searchRes = await this.kcAdminClient.clients.find({
      clientId: 'realm-management',
      realm: realmName,
    });
    const realmManagementClient = searchRes[0];
    this.currentClient = realmManagementClient;

    const groupName = faker.internet.userName().toLowerCase();
    const group = await this.kcAdminClient.groups.create({
      name: groupName,
      realm: realmName,
    });
    this.currentGroup = group;
  });

  it('should create group policy', async () => {
    const policyName = faker.internet.userName().toLowerCase();
    const policy = await this.kcAdminClient.clients.createPolicy({
      realm: this.currentRealm,
      id: this.currentClient.id,
      type: 'group',
      logic: Logic.POSITIVE,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      name: policyName,
      groups: [{id: this.currentGroup.id}],
    });
    expect(policy).to.be.ok;
    this.policyId = policy.id;
  });

  it('should get group policy', async () => {
    const policy = await this.kcAdminClient.clients.getPolicy({
      id: this.currentClient.id,
      policyId: this.policyId,
      type: 'group',
      realm: this.currentRealm,
    });
    expect(policy).to.be.ok;
  });

  it('should create scope permission with policy', async () => {
    const permissionName = faker.internet.userName().toLowerCase();
    const permission = await this.kcAdminClient.clients.createPermission({
      id: this.currentClient.id,
      type: 'scope',
      realm: this.currentRealm,
      logic: Logic.POSITIVE,
      decisionStrategy: DecisionStrategy.UNANIMOUS,
      name: permissionName,
      resources: ['Users'],
      scopes: ['manage'],
      policies: [this.policyId],
    });
    expect(permission).to.be.ok;
    this.permissionId = permission.id;
  });

  it('should get scope permission', async () => {
    const permission = await this.kcAdminClient.clients.getPermission({
      id: this.currentClient.id,
      type: 'scope',
      realm: this.currentRealm,
      permissionId: this.permissionId,
    });
    expect(permission).to.be.ok;
  });

  it('should delete scope permission', async () => {
    await this.kcAdminClient.clients.deletePolicy({
      id: this.currentClient.id,
      policyId: this.permissionId,
      realm: this.currentRealm,
    });
  });

  it('should delete group policy', async () => {
    await this.kcAdminClient.clients.deletePolicy({
      id: this.currentClient.id,
      policyId: this.policyId,
      realm: this.currentRealm,
    });
  });

  after(async () => {
    // delete test realm
    await this.kcAdminClient.realms.del({realm: this.currentRealm});
    const realm = await this.kcAdminClient.realms.findOne({
      realm: this.currentRealm,
    });
    expect(realm).to.be.null;
  });
});
