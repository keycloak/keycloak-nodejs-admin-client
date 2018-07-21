// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import faker from 'faker';
import UserRepresentation, {RequiredAction} from '../src/defs/userRepresentation';
import RoleRepresentation from '../src/defs/roleRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    client?: KeycloakAdminClient;
    currentUser?: UserRepresentation;
    currentRole?: RoleRepresentation;
  }
}

describe('Users', function() {
  before(async () => {
    this.client = new KeycloakAdminClient();
    await this.client.auth(cred);
    // initialize user
    const username = faker.internet.userName();
    await this.client.users.create({
      username
    });
    const users = await this.client.users.find({username});
    expect(users[0]).to.be.ok;
    this.currentUser = users[0];
  });

  after(async () => {
    const userId = this.currentUser.id;
    await this.client.users.del({
      id: userId
    });

    const user = await this.client.users.findOne({
      id: userId
    });
    expect(user).to.be.null;
  });

  it('list users', async () => {
    const users = await this.client.users.find();
    expect(users).to.be.ok;
  });

  it('get single users', async () => {
    const userId = this.currentUser.id;
    const user = await this.client.users.findOne({
      id: userId
    });
    expect(user).to.be.deep.include(this.currentUser);
  });

  it('update single users', async () => {
    const userId = this.currentUser.id;
    await this.client.users.update({id: userId}, {
      firstName: 'william',
      lastName: 'chang',
      requiredActions: [RequiredAction.UPDATE_PASSWORD],
      emailVerified: true
    });

    const user = await this.client.users.findOne({
      id: userId
    });
    expect(user).to.deep.include({
      firstName: 'william',
      lastName: 'chang',
      requiredActions: [RequiredAction.UPDATE_PASSWORD],
      emailVerified: true
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

    it('add a role to user', async () => {
      // add role-mappings with role id
      await this.client.users.addRealmRoleMappings({
        id: this.currentUser.id,

        // at least id and name should appear
        roles: [{
          id: this.currentRole.id,
          name: this.currentRole.name
        }]
      });
    });

    it('list available role-mappings for user', async () => {
      const roles = await this.client.users.listAvailableRealmRoleMappings({
        id: this.currentUser.id
      });

      // admin, create-realm
      // not sure why others like offline_access, uma_authorization not included
      expect(roles.length).to.be.least(2);
    });

    it('list role-mappings of user', async () => {
      const res = await this.client.users.listRoleMappings({
        id: this.currentUser.id
      });

      expect(res).have.all.keys('realmMappings', 'clientMappings');
    });

    it('list realm role-mappings of user', async () => {
      const roles = await this.client.users.listRealmRoleMappings({
        id: this.currentUser.id
      });
      expect(roles).to.deep.include(this.currentRole);
    });

    it('del realm role-mappings from user', async () => {
      await this.client.users.delRealmRoleMappings({
        id: this.currentUser.id,
        roles: [{
          id: this.currentRole.id,
          name: this.currentRole.name
        }]
      });

      const roles = await this.client.users.listRealmRoleMappings({
        id: this.currentUser.id
      });
      expect(roles).to.not.deep.include(this.currentRole);
    });
  });
});
