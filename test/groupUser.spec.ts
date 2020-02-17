// tslint:disable:no-unused-expression
import * as chai from 'chai';
import faker from 'faker';
import {omit, pick} from 'lodash';
import {KeycloakAdminClient} from '../src/client';
import ClientRepresentation from '../src/defs/clientRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';
import PolicyRepresentation, {DecisionStrategy, Logic} from '../src/defs/policyRepresentation';
import UserRepresentation from '../src/defs/userRepresentation';
import {credentials} from './constants';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    managementClient?: ClientRepresentation;
    currentGroup?: GroupRepresentation;
    currentUser?: UserRepresentation;
    currentUserPolicy: PolicyRepresentation;
    currentPolicy: PolicyRepresentation;
  }
}

describe('Group user integration', function () {
  before(async () => {
    const groupName = faker.internet.userName();
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);
    // create group
    const group = await this.kcAdminClient.groups.create({
      name: groupName,
    });
    this.currentGroup = await this.kcAdminClient.groups.findOne({id: group.id});

    // create user
    const username = faker.internet.userName();
    const user = await this.kcAdminClient.users.create({
      username,
      email: 'wwwy3y3@canner.io',
      enabled: true,
    });
    this.currentUser = await this.kcAdminClient.users.findOne({id: user.id});
  });

  after(async () => {
    await this.kcAdminClient.groups.del({
      id: this.currentGroup.id,
    });
    await this.kcAdminClient.users.del({
      id: this.currentUser.id,
    });
  });

  it("should list user's group and expect empty", async () => {
    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id,
    });
    expect(groups).to.be.eql([]);
  });

  it('should add user to group', async () => {
    await this.kcAdminClient.users.addToGroup({
      id: this.currentUser.id,
      groupId: this.currentGroup.id,
    });

    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id,
    });
    // expect id,name,path to be the same
    expect(groups[0]).to.be.eql(
      pick(this.currentGroup, ['id', 'name', 'path']),
    );
  });

  it('should list members using group api', async () => {
    const members = await this.kcAdminClient.groups.listMembers({
      id: this.currentGroup.id,
    });
    // access will not returned from member api
    expect(members[0]).to.be.eql(omit(this.currentUser, ['access']));
  });

  it('should remove user from group', async () => {
    await this.kcAdminClient.users.delFromGroup({
      id: this.currentUser.id,
      groupId: this.currentGroup.id,
    });

    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id,
    });
    expect(groups).to.be.eql([]);
  });

  /**
  * Authorization permissions
  */
  describe('authorization permissions', () => {
    before(async () => {
      const clients = await this.kcAdminClient.clients.find();
      this.managementClient = clients.find(client => client.clientId === 'realm-management')
    });

    after(async () => {
      await this.kcAdminClient.clients.delPolicy({
        id: this.managementClient.id,
        policyId: this.currentUserPolicy.id
      });
    });

    it('Enable permissions', async () => {
      const permission = await this.kcAdminClient.groups.updatePermission({id: this.currentGroup.id}, {enabled: true});
      expect(permission).to.include({
        enabled: true,
      });
    });

    it('list of users in policy management', async () => {
      const userPolicyData: PolicyRepresentation = {
        type: 'user',
        logic: Logic.POSITIVE,
        decisionStrategy: DecisionStrategy.UNANIMOUS,
        name: `policy.manager.${this.currentGroup.id}`,
        users: [this.currentUser.id],
      };
      this.currentUserPolicy = await this.kcAdminClient.clients.createUserPolicy({id: this.managementClient.id}, userPolicyData)

      expect(this.currentUserPolicy).to.include({
        type: 'user',
        logic: Logic.POSITIVE,
        decisionStrategy: DecisionStrategy.UNANIMOUS,
        name: `policy.manager.${this.currentGroup.id}`
      });
    });

    it('list the roles available for this group', async () => {
      const permissions = await this.kcAdminClient.groups.listPermissions({id: this.currentGroup.id});

      expect(permissions.scopePermissions).to.be.an('object');

      const scopes = await this.kcAdminClient.clients.listScopes({
        id: this.managementClient.id,
        ressourceName: permissions.resource,
      });

      expect(scopes).to.have.length(5);

      // Search for the id of the management role
      const roleId = scopes.find(scope => scope.name === 'manage').id;

      const userPolicy = await this.kcAdminClient.clients.findByName({id: this.managementClient.id, name: `policy.manager.${this.currentGroup.id}`})

      expect(userPolicy).to.deep.include({
        name: `policy.manager.${this.currentGroup.id}`
      });

      // Update of the role with the above modifications
      const policyData: PolicyRepresentation = {
        id: permissions.scopePermissions.manage,
        name: `manage.permission.group.${this.currentGroup.id}`,
        type: 'scope',
        logic: Logic.POSITIVE,
        decisionStrategy: DecisionStrategy.UNANIMOUS,
        resources: [permissions.resource],
        scopes: [roleId],
        policies: [userPolicy.id],
      };
      await this.kcAdminClient.clients.updateScopePermission(
        {
          id: this.managementClient.id,
          scopePermissionId: permissions.scopePermissions.manage,
        },
        policyData,
      );
      this.currentPolicy = await this.kcAdminClient.clients.findOneScopePermission({
        id: this.managementClient.id,
        scopePermissionId: permissions.scopePermissions.manage,
      })
      expect(this.currentPolicy).to.deep.include({
        id: permissions.scopePermissions.manage,
        name: `manage.permission.group.${this.currentGroup.id}`,
        type: 'scope',
        logic: Logic.POSITIVE,
        decisionStrategy: DecisionStrategy.UNANIMOUS,
      });
    });
  });
});
