// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import UserRepresentation from '../src/defs/userRepresentation';
import RoleRepresentation from '../src/defs/roleRepresentation';
import ClientRepresentation from '../src/defs/clientRepresentation';
import {RequiredActionAlias} from '../src/defs/requiredActionProviderRepresentation';
import FederatedIdentityRepresentation from '../src/defs/federatedIdentityRepresentation';
import {omit} from 'lodash';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentClient?: ClientRepresentation;
    currentUser?: UserRepresentation;
    currentRole?: RoleRepresentation;
    federatedIdentity?: FederatedIdentityRepresentation;
  }
}

describe('Users', function() {
  this.timeout(10000);

  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);
    // initialize user
    const username = faker.internet.userName();
    const user = await this.kcAdminClient.users.create({
      username,
      email: 'wwwy3y3@canner.io',
      // enabled required to be true in order to send actions email
      emailVerified: true,
      enabled: true,
    });

    expect(user.id).to.be.ok;
    this.currentUser = await this.kcAdminClient.users.findOne({id: user.id});

    // add smtp to realm
    await this.kcAdminClient.realms.update(
      {realm: 'master'},
      {
        smtpServer: {
          auth: true,
          from: '0830021730-07fb21@inbox.mailtrap.io',
          host: 'smtp.mailtrap.io',
          user: process.env.SMTP_USER,
          password: process.env.SMTP_PWD,
        },
      },
    );
  });

  after(async () => {
    const userId = this.currentUser.id;
    await this.kcAdminClient.users.del({
      id: userId,
    });

    const user = await this.kcAdminClient.users.findOne({
      id: userId,
    });
    expect(user).to.be.null;
  });

  it('list users', async () => {
    const users = await this.kcAdminClient.users.find();
    expect(users).to.be.ok;
  });

  it('get single users', async () => {
    const userId = this.currentUser.id;
    const user = await this.kcAdminClient.users.findOne({
      id: userId,
    });
    expect(user).to.be.deep.include(this.currentUser);
  });

  it('update single users', async () => {
    const userId = this.currentUser.id;
    await this.kcAdminClient.users.update(
      {id: userId},
      {
        firstName: 'william',
        lastName: 'chang',
        requiredActions: [RequiredActionAlias.UPDATE_PASSWORD],
        emailVerified: true,
      },
    );

    const user = await this.kcAdminClient.users.findOne({
      id: userId,
    });
    expect(user).to.deep.include({
      firstName: 'william',
      lastName: 'chang',
      requiredActions: [RequiredActionAlias.UPDATE_PASSWORD],
      emailVerified: true,
    });
  });

  /**
   * exeute actions email
   */
  it('should send user exeute actions email', async () => {
    // if travis skip it, cause travis close smtp port
    if (process.env.TRAVIS) {
      return;
    }
    const userId = this.currentUser.id;
    await this.kcAdminClient.users.executeActionsEmail({
      id: userId,
      lifespan: 43200,
      actions: [RequiredActionAlias.UPDATE_PASSWORD],
    });
  });

  /**
   * remove totp
   */

  it('should remove totp', async () => {
    // todo: find a way to add totp from api
    const userId = this.currentUser.id;
    await this.kcAdminClient.users.removeTotp({
      id: userId,
    });
  });

  /**
   * reset password
   */

  it('should reset user password', async () => {
    // todo: find a way to validate the reset-password result
    const userId = this.currentUser.id;
    await this.kcAdminClient.users.resetPassword({
      id: userId,
      credential: {
        temporary: false,
        type: 'password',
        value: 'test',
      },
    });
  });

  /**
   * send verify email
   */

  it('should send user verify email', async () => {
    // if travis skip it, cause travis close smtp port
    if (process.env.TRAVIS) {
      return;
    }
    const userId = this.currentUser.id;
    await this.kcAdminClient.users.sendVerifyEmail({
      id: userId,
    });
  });

  /**
   * Role mappings
   */
  describe('role-mappings', () => {
    before(async () => {
      // create new role
      const roleName = faker.internet.userName();
      await this.kcAdminClient.roles.create({
        name: roleName,
      });
      const role = await this.kcAdminClient.roles.findOneByName({
        name: roleName,
      });
      this.currentRole = role;
    });

    after(async () => {
      await this.kcAdminClient.roles.delByName({name: this.currentRole.name});
    });

    it('add a role to user', async () => {
      // add role-mappings with role id
      await this.kcAdminClient.users.addRealmRoleMappings({
        id: this.currentUser.id,

        // at least id and name should appear
        roles: [
          {
            id: this.currentRole.id,
            name: this.currentRole.name,
          },
        ],
      });
    });

    it('list available role-mappings for user', async () => {
      const roles = await this.kcAdminClient.users.listAvailableRealmRoleMappings(
        {
          id: this.currentUser.id,
        },
      );

      // admin, create-realm
      // not sure why others like offline_access, uma_authorization not included
      expect(roles.length).to.be.least(2);
    });

    it('list role-mappings of user', async () => {
      const res = await this.kcAdminClient.users.listRoleMappings({
        id: this.currentUser.id,
      });

      expect(res).have.all.keys('realmMappings', 'clientMappings');
    });

    it('list realm role-mappings of user', async () => {
      const roles = await this.kcAdminClient.users.listRealmRoleMappings({
        id: this.currentUser.id,
      });
      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(roles).to.deep.include(omit(this.currentRole, 'attributes'));
    });

    it('list realm composite role-mappings of user', async () => {
      const roles = await this.kcAdminClient.users.listCompositeRealmRoleMappings(
        {
          id: this.currentUser.id,
        },
      );
      // todo: add data integrity check later
      expect(roles).to.be.ok;
    });

    it('del realm role-mappings from user', async () => {
      await this.kcAdminClient.users.delRealmRoleMappings({
        id: this.currentUser.id,
        roles: [
          {
            id: this.currentRole.id,
            name: this.currentRole.name,
          },
        ],
      });

      const roles = await this.kcAdminClient.users.listRealmRoleMappings({
        id: this.currentUser.id,
      });
      expect(roles).to.not.deep.include(this.currentRole);
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

    it('add a client role to user', async () => {
      // add role-mappings with role id
      await this.kcAdminClient.users.addClientRoleMappings({
        id: this.currentUser.id,
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

    it('list available client role-mappings for user', async () => {
      const roles = await this.kcAdminClient.users.listAvailableClientRoleMappings(
        {
          id: this.currentUser.id,
          clientUniqueId: this.currentClient.id,
        },
      );

      expect(roles).to.be.empty;
    });

    it('list client role-mappings of user', async () => {
      const roles = await this.kcAdminClient.users.listClientRoleMappings({
        id: this.currentUser.id,
        clientUniqueId: this.currentClient.id,
      });

      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(this.currentRole).to.deep.include(roles[0]);
    });

    it('del client role-mappings from user', async () => {
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
      await this.kcAdminClient.users.delClientRoleMappings({
        id: this.currentUser.id,
        clientUniqueId: this.currentClient.id,
        roles: [
          {
            id: role.id,
            name: role.name,
          },
        ],
      });

      // check if mapping is successfully deleted
      const roles = await this.kcAdminClient.users.listClientRoleMappings({
        id: this.currentUser.id,
        clientUniqueId: this.currentClient.id,
      });

      // should only left the one we added in the previous test
      expect(roles.length).to.be.eql(1);
    });
  });

  describe('Federated Identity user integration', function() {
    before(async () => {
      this.kcAdminClient = new KeycloakAdminClient();
      await this.kcAdminClient.auth(credentials);

      // create user
      const username = faker.internet.userName();
      await this.kcAdminClient.users.create({
        username,
        email: 'wwwy3y3-federated@canner.io',
        enabled: true,
      });
      const users = await this.kcAdminClient.users.find({username});
      expect(users[0]).to.be.ok;
      this.currentUser = users[0];
      this.federatedIdentity = {
        identityProvider: 'foobar',
        userId: 'userid1',
        userName: 'username1',
      };
    });

    after(async () => {
      await this.kcAdminClient.users.del({
        id: this.currentUser.id,
      });
    });

    it('should list user\'s federated identities and expect empty', async () => {
      const federatedIdentities = await this.kcAdminClient.users.listFederatedIdentities(
        {
          id: this.currentUser.id,
        },
      );
      expect(federatedIdentities).to.be.eql([]);
    });

    it('should add federated identity to user', async () => {
      await this.kcAdminClient.users.addToFederatedIdentity({
        id: this.currentUser.id,
        federatedIdentityId: 'foobar',
        federatedIdentity: this.federatedIdentity,
      });

      // @TODO: In order to test the integration with federated identities, the User Federation
      // would need to be created first, this is not implemented yet.
      // const federatedIdentities = await this.kcAdminClient.users.listFederatedIdentities({
      //   id: this.currentUser.id,
      // });
      // expect(federatedIdentities[0]).to.be.eql(this.federatedIdentity);
    });

    it('should remove federated identity from user', async () => {
      await this.kcAdminClient.users.delFromFederatedIdentity({
        id: this.currentUser.id,
        federatedIdentityId: 'foobar',
      });

      const federatedIdentities = await this.kcAdminClient.users.listFederatedIdentities(
        {
          id: this.currentUser.id,
        },
      );
      expect(federatedIdentities).to.be.eql([]);
    });
  });
});
