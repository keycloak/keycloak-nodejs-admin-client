// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import GroupRepresentation from '../src/defs/groupRepresentation';
import RoleRepresentation from '../src/defs/roleRepresentation';
import ClientRepresentation from '../src/defs/clientRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentClient?: ClientRepresentation;
    currentGroup?: GroupRepresentation;
    currentRole?: RoleRepresentation;
  }
}

describe('Groups', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);
    // initialize group
    const group = await this.kcAdminClient.groups.create({
      name: 'cool-group',
    });
    expect(group.id).to.be.ok;
    this.currentGroup = await this.kcAdminClient.groups.findOne({id: group.id});
  });

  after(async () => {
    const groupId = this.currentGroup.id;
    await this.kcAdminClient.groups.del({
      id: groupId,
    });

    const group = await this.kcAdminClient.groups.findOne({
      id: groupId,
    });
    expect(group).to.be.null;
  });

  it('list groups', async () => {
    const groups = await this.kcAdminClient.groups.find();
    expect(groups).to.be.ok;
  });

  it('get single groups', async () => {
    const groupId = this.currentGroup.id;
    const group = await this.kcAdminClient.groups.findOne({
      id: groupId,
    });
    // get group from id will contains more fields than listing api
    expect(group).to.deep.include(this.currentGroup);
  });

  it('update single groups', async () => {
    const groupId = this.currentGroup.id;
    await this.kcAdminClient.groups.update(
      {id: groupId},
      {name: 'another-group-name'},
    );

    const group = await this.kcAdminClient.groups.findOne({
      id: groupId,
    });
    expect(group).to.include({
      name: 'another-group-name',
    });
  });

  it('set or create child', async () => {
    const groupName = 'child-group';
    const groupId = this.currentGroup.id;
    const childGroup = await this.kcAdminClient.groups.setOrCreateChild(
      {id: groupId},
      {name: groupName},
    );

    expect(childGroup.id).to.be.ok;

    const group = await this.kcAdminClient.groups.findOne({
      id: groupId,
    });
    expect(group.subGroups[0]).to.deep.include({
      id: childGroup.id,
      name: groupName,
      path: `/${group.name}/${groupName}`,
    });
  });

  /**
   * Role mappings
   */
  describe('role-mappings', () => {
    before(async () => {
      // create new role
      const roleName = faker.internet.userName();
      const {roleName: createdRoleName} = await this.kcAdminClient.roles.create(
        {
          name: roleName,
        },
      );
      expect(createdRoleName).to.be.equal(roleName);
      const role = await this.kcAdminClient.roles.findOneByName({
        name: roleName,
      });
      this.currentRole = role;
    });

    after(async () => {
      await this.kcAdminClient.roles.delByName({name: this.currentRole.name});
    });

    it('add a role to group', async () => {
      // add role-mappings with role id
      await this.kcAdminClient.groups.addRealmRoleMappings({
        id: this.currentGroup.id,

        // at least id and name should appear
        roles: [
          {
            id: this.currentRole.id,
            name: this.currentRole.name,
          },
        ],
      });
    });

    it('list available role-mappings', async () => {
      const roles = await this.kcAdminClient.groups.listAvailableRealmRoleMappings(
        {
          id: this.currentGroup.id,
        },
      );

      // admin, create-realm, offline_access, uma_authorization
      expect(roles.length).to.be.least(4);
    });

    it('list role-mappings', async () => {
      const {realmMappings} = await this.kcAdminClient.groups.listRoleMappings({
        id: this.currentGroup.id,
      });

      expect(realmMappings).to.be.ok;
      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(this.currentRole).to.deep.include(realmMappings[0]);
    });

    it('list realm role-mappings of group', async () => {
      const roles = await this.kcAdminClient.groups.listRealmRoleMappings({
        id: this.currentGroup.id,
      });
      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(this.currentRole).to.deep.include(roles[0]);
    });

    it('del realm role-mappings from group', async () => {
      await this.kcAdminClient.groups.delRealmRoleMappings({
        id: this.currentGroup.id,
        roles: [
          {
            id: this.currentRole.id,
            name: this.currentRole.name,
          },
        ],
      });

      const roles = await this.kcAdminClient.groups.listRealmRoleMappings({
        id: this.currentGroup.id,
      });
      expect(roles).to.be.empty;
    });
  });

  /**
   * client Role mappings
   */
  describe('client role-mappings', () => {
    before(async () => {
      // create new client
      const clientId = faker.internet.userName();
      await this.kcAdminClient.clients.create({
        clientId,
      });

      const clients = await this.kcAdminClient.clients.find({clientId});
      expect(clients[0]).to.be.ok;
      this.currentClient = clients[0];

      // create new client role
      const roleName = faker.internet.userName();
      await this.kcAdminClient.clients.createRole({
        id: this.currentClient.id,
        name: roleName,
      });

      // assign to currentRole
      this.currentRole = await this.kcAdminClient.clients.findRole({
        id: this.currentClient.id,
        roleName,
      });
    });

    after(async () => {
      await this.kcAdminClient.clients.delRole({
        id: this.currentClient.id,
        roleName: this.currentRole.name,
      });
      await this.kcAdminClient.clients.del({id: this.currentClient.id});
    });

    it('add a client role to group', async () => {
      // add role-mappings with role id
      await this.kcAdminClient.groups.addClientRoleMappings({
        id: this.currentGroup.id,
        clientUniqueId: this.currentClient.id,

        // at least id and name should appear
        roles: [
          {
            id: this.currentRole.id,
            name: this.currentRole.name,
          },
        ],
      });
    });

    it('list available client role-mappings for group', async () => {
      const roles = await this.kcAdminClient.groups.listAvailableClientRoleMappings(
        {
          id: this.currentGroup.id,
          clientUniqueId: this.currentClient.id,
        },
      );

      expect(roles).to.be.empty;
    });

    it('list client role-mappings of group', async () => {
      const roles = await this.kcAdminClient.groups.listClientRoleMappings({
        id: this.currentGroup.id,
        clientUniqueId: this.currentClient.id,
      });

      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(this.currentRole).to.deep.include(roles[0]);
    });

    it('del client role-mappings from group', async () => {
      const roleName = faker.internet.userName();
      await this.kcAdminClient.clients.createRole({
        id: this.currentClient.id,
        name: roleName,
      });
      const role = await this.kcAdminClient.clients.findRole({
        id: this.currentClient.id,
        roleName,
      });

      // delete the created role
      await this.kcAdminClient.groups.delClientRoleMappings({
        id: this.currentGroup.id,
        clientUniqueId: this.currentClient.id,
        roles: [
          {
            id: role.id,
            name: role.name,
          },
        ],
      });

      // check if mapping is successfully deleted
      const roles = await this.kcAdminClient.groups.listClientRoleMappings({
        id: this.currentGroup.id,
        clientUniqueId: this.currentClient.id,
      });

      // should only left the one we added in the previous test
      expect(roles.length).to.be.eql(1);
    });
  });
});
