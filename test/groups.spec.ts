// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import faker from 'faker';
import UserRepresentation from '../src/defs/userRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';
import { TIMEOUT } from 'dns';
import RoleRepresentation from '../src/defs/roleRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    client?: KeycloakAdminClient;
    currentGroup?: GroupRepresentation;
    currentRole?: RoleRepresentation;
  }
}

describe('Groups', function() {
  before(async () => {
    this.client = new KeycloakAdminClient();
    await this.client.auth(cred);
    // initialize group
    await this.client.groups.create({
      name: 'cool-group'
    });
    const groups = await this.client.groups.find({search: 'cool-group'});
    this.currentGroup = groups[0];
  });

  after(async () => {
    const groupId = this.currentGroup.id;
    await this.client.groups.del({
      id: groupId
    });

    const group = await this.client.groups.findOne({
      id: groupId
    });
    expect(group).to.be.null;
  });

  it('list groups', async () => {
    const groups = await this.client.groups.find();
    expect(groups).to.be.ok;
  });

  it('get single groups', async () => {
    const groupId = this.currentGroup.id;
    const group = await this.client.groups.findOne({
      id: groupId
    });
    // get group from id will contains more fields than listing api
    expect(group).to.deep.include(this.currentGroup);
  });

  it('update single groups', async () => {
    const groupId = this.currentGroup.id;
    await this.client.groups.update({id: groupId}, {name: 'another-group-name'});

    const group = await this.client.groups.findOne({
      id: groupId
    });
    expect(group).to.include({
      name: 'another-group-name'
    });
  });

  /**
   * Role mappings
   */
  describe('role-mappings', () => {
    before(async () => {
      // create new role
      const roleName = faker.internet.userName();
      await this.client.roles.create({
        name: roleName
      });
      const role = await this.client.roles.findOneByName({
        name: roleName
      });
      this.currentRole = role;
    });

    after(async () => {
      await this.client.roles.delByName({name: this.currentRole.name});
    });

    it('add a role to group', async () => {
      // add role-mappings with role id
      await this.client.groups.addRealmRoleMappings({
        id: this.currentGroup.id,

        // at least id and name should appear
        roles: [{
          id: this.currentRole.id,
          name: this.currentRole.name
        }]
      });
    });

    it('list available role-mappings', async () => {
      const roles = await this.client.groups.listAvailableRealmRoleMappings({
        id: this.currentGroup.id
      });

      // admin, create-realm, offline_access, uma_authorization
      expect(roles.length).to.be.least(4);
    });

    it('list role-mappings', async () => {
      const {realmMappings} = await this.client.groups.listRoleMappings({
        id: this.currentGroup.id
      });

      expect(realmMappings).to.be.ok;
      expect(realmMappings[0]).to.be.eql(this.currentRole);
    });

    it('list realm role-mappings of group', async () => {
      const roles = await this.client.groups.listRealmRoleMappings({
        id: this.currentGroup.id
      });
      expect(roles[0]).to.be.eql(this.currentRole);
    });

    it('del realm role-mappings from group', async () => {
      await this.client.groups.delRealmRoleMappings({
        id: this.currentGroup.id,
        roles: [{
          id: this.currentRole.id,
          name: this.currentRole.name
        }]
      });

      const roles = await this.client.groups.listRealmRoleMappings({
        id: this.currentGroup.id
      });
      expect(roles).to.be.empty;
    });
  });
});
