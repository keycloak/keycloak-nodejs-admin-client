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

describe('Users', function () {
  let kcAdminClient: KeycloakAdminClient;
  let currentClient: ClientRepresentation;
  let currentUser: UserRepresentation;
  let currentRole: RoleRepresentation;
  let federatedIdentity: FederatedIdentityRepresentation;
  this.timeout(10000);

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
    // initialize user
    const username = faker.internet.userName();
    const user = await kcAdminClient.users.create({
      username,
      email: 'wwwy3y3@canner.io',
      // enabled required to be true in order to send actions email
      emailVerified: true,
      enabled: true,
    });

    expect(user.id).to.be.ok;
    currentUser = await kcAdminClient.users.findOne({id: user.id});

    // add smtp to realm
    await kcAdminClient.realms.update(
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
    const userId = currentUser.id;
    await kcAdminClient.users.del({
      id: userId,
    });

    const user = await kcAdminClient.users.findOne({
      id: userId,
    });
    expect(user).to.be.null;
  });

  it('list users', async () => {
    const users = await kcAdminClient.users.find();
    expect(users).to.be.ok;
  });

  it('count users', async () => {
    const numUsers = await kcAdminClient.users.count();
    // admin user + created user in before hook
    expect(numUsers).to.equal(2);
  });

  it('count users with filter', async () => {
    const numUsers = await kcAdminClient.users.count({email: 'wwwy3y3@canner.io'});
    expect(numUsers).to.equal(1);
  });

  it('get single users', async () => {
    const userId = currentUser.id;
    const user = await kcAdminClient.users.findOne({
      id: userId,
    });
    expect(user).to.be.deep.include(currentUser);
  });

  it('update single users', async () => {
    const userId = currentUser.id;
    await kcAdminClient.users.update(
      {id: userId},
      {
        firstName: 'william',
        lastName: 'chang',
        requiredActions: [RequiredActionAlias.UPDATE_PASSWORD],
        emailVerified: true,
      },
    );

    const user = await kcAdminClient.users.findOne({
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
  it('should send user execute actions email', async () => {
    // if travis skip it, cause travis close smtp port
    if (process.env.TRAVIS) {
      return;
    }
    const userId = currentUser.id;
    await kcAdminClient.users.executeActionsEmail({
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
    const userId = currentUser.id;
    await kcAdminClient.users.removeTotp({
      id: userId,
    });
  });

  /**
   * reset password
   */

  it('should reset user password', async () => {
    // todo: find a way to validate the reset-password result
    const userId = currentUser.id;
    await kcAdminClient.users.resetPassword({
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
    const userId = currentUser.id;
    await kcAdminClient.users.sendVerifyEmail({
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
      await kcAdminClient.roles.create({
        name: roleName,
      });
      const role = await kcAdminClient.roles.findOneByName({
        name: roleName,
      });
      currentRole = role;
    });

    after(async () => {
      await kcAdminClient.roles.delByName({name: currentRole.name});
    });

    it('add a role to user', async () => {
      // add role-mappings with role id
      await kcAdminClient.users.addRealmRoleMappings({
        id: currentUser.id,

        // at least id and name should appear
        roles: [
          {
            id: currentRole.id,
            name: currentRole.name,
          },
        ],
      });
    });

    it('list available role-mappings for user', async () => {
      const roles = await kcAdminClient.users.listAvailableRealmRoleMappings({
        id: currentUser.id,
      });

      // admin, create-realm
      // not sure why others like offline_access, uma_authorization not included
      expect(roles.length).to.be.least(2);
    });

    it('list role-mappings of user', async () => {
      const res = await kcAdminClient.users.listRoleMappings({
        id: currentUser.id,
      });

      expect(res).have.all.keys('realmMappings', 'clientMappings');
    });

    it('list realm role-mappings of user', async () => {
      const roles = await kcAdminClient.users.listRealmRoleMappings({
        id: currentUser.id,
      });
      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(roles).to.deep.include(omit(currentRole, 'attributes'));
    });

    it('list realm composite role-mappings of user', async () => {
      const roles = await kcAdminClient.users.listCompositeRealmRoleMappings({
        id: currentUser.id,
      });
      // todo: add data integrity check later
      expect(roles).to.be.ok;
    });

    it('del realm role-mappings from user', async () => {
      await kcAdminClient.users.delRealmRoleMappings({
        id: currentUser.id,
        roles: [
          {
            id: currentRole.id,
            name: currentRole.name,
          },
        ],
      });

      const roles = await kcAdminClient.users.listRealmRoleMappings({
        id: currentUser.id,
      });
      expect(roles).to.not.deep.include(currentRole);
    });
  });

  /**
   * client Role mappings
   */
  describe('client role-mappings', () => {
    before(async () => {
      // create new client
      const clientId = faker.internet.userName();
      await kcAdminClient.clients.create({
        clientId,
      });

      const clients = await kcAdminClient.clients.find({clientId});
      expect(clients[0]).to.be.ok;
      currentClient = clients[0];

      // create new client role
      const roleName = faker.internet.userName();
      await kcAdminClient.clients.createRole({
        id: currentClient.id,
        name: roleName,
      });

      // assign to currentRole
      currentRole = await kcAdminClient.clients.findRole({
        id: currentClient.id,
        roleName,
      });
    });

    after(async () => {
      await kcAdminClient.clients.delRole({
        id: currentClient.id,
        roleName: currentRole.name,
      });
      await kcAdminClient.clients.del({id: currentClient.id});
    });

    it('add a client role to user', async () => {
      // add role-mappings with role id
      await kcAdminClient.users.addClientRoleMappings({
        id: currentUser.id,
        clientUniqueId: currentClient.id,

        // at least id and name should appear
        roles: [
          {
            id: currentRole.id,
            name: currentRole.name,
          },
        ],
      });
    });

    it('list available client role-mappings for user', async () => {
      const roles = await kcAdminClient.users.listAvailableClientRoleMappings({
        id: currentUser.id,
        clientUniqueId: currentClient.id,
      });

      expect(roles).to.be.empty;
    });

    it('list client role-mappings of user', async () => {
      const roles = await kcAdminClient.users.listClientRoleMappings({
        id: currentUser.id,
        clientUniqueId: currentClient.id,
      });

      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(currentRole).to.deep.include(roles[0]);
    });

    it('del client role-mappings from user', async () => {
      const roleName = faker.internet.userName();
      await kcAdminClient.clients.createRole({
        id: currentClient.id,
        name: roleName,
      });
      const role = await kcAdminClient.clients.findRole({
        id: currentClient.id,
        roleName,
      });

      // delete the created role
      await kcAdminClient.users.delClientRoleMappings({
        id: currentUser.id,
        clientUniqueId: currentClient.id,
        roles: [
          {
            id: role.id,
            name: role.name,
          },
        ],
      });

      // check if mapping is successfully deleted
      const roles = await kcAdminClient.users.listClientRoleMappings({
        id: currentUser.id,
        clientUniqueId: currentClient.id,
      });

      // should only left the one we added in the previous test
      expect(roles.length).to.be.eql(1);
    });
  });

  describe('User sessions', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      // create client
      const clientId = faker.internet.userName();
      await kcAdminClient.clients.create({
        clientId,
        consentRequired: true,
      });

      const clients = await kcAdminClient.clients.find({clientId});
      expect(clients[0]).to.be.ok;
      currentClient = clients[0];
    });

    after(async () => {
      await kcAdminClient.clients.del({
        id: currentClient.id,
      });
    });

    it('list user sessions', async () => {
      // @TODO: In order to test it, currentUser has to be logged in
      const userSessions = await kcAdminClient.users.listSessions({
        id: currentUser.id,
      });

      expect(userSessions).to.be.ok;
    });

    it('list users off-line sessions', async () => {
      // @TODO: In order to test it, currentUser has to be logged in
      const userOfflineSessions = await kcAdminClient.users.listOfflineSessions(
        {id: currentUser.id, clientId: currentClient.id},
      );

      expect(userOfflineSessions).to.be.ok;
    });

    it('logout user from all sessions', async () => {
      // @TODO: In order to test it, currentUser has to be logged in
      await kcAdminClient.users.logout({id: currentUser.id});
    });

    it('list consents granted by the user', async () => {
      const consents = await kcAdminClient.users.listConsents({
        id: currentUser.id,
      });

      expect(consents).to.be.ok;
    });

    it('revoke consent and offline tokens for particular client', async () => {
      // @TODO: In order to test it, currentUser has to granted consent to client
      const consents = await kcAdminClient.users.listConsents({
        id: currentUser.id,
      });

      if (consents.length) {
        const consent = consents[0];

        await kcAdminClient.users.revokeConsent({
          id: currentUser.id,
          clientId: consent.clientId,
        });
      }
    });
  });

  describe('Federated Identity user integration', () => {
    before(async () => {
      kcAdminClient = new KeycloakAdminClient();
      await kcAdminClient.auth(credentials);

      federatedIdentity = {
        identityProvider: 'foobar',
        userId: 'userid1',
        userName: 'username1',
      };
    });

    it('should list user\'s federated identities and expect empty', async () => {
      const federatedIdentities = await kcAdminClient.users.listFederatedIdentities(
        {
          id: currentUser.id,
        },
      );
      expect(federatedIdentities).to.be.eql([]);
    });

    it('should add federated identity to user', async () => {
      await kcAdminClient.users.addToFederatedIdentity({
        id: currentUser.id,
        federatedIdentityId: 'foobar',
        federatedIdentity,
      });

      // @TODO: In order to test the integration with federated identities, the User Federation
      // would need to be created first, this is not implemented yet.
      // const federatedIdentities = await kcAdminClient.users.listFederatedIdentities({
      //   id: currentUser.id,
      // });
      // expect(federatedIdentities[0]).to.be.eql(federatedIdentity);
    });

    it('should remove federated identity from user', async () => {
      await kcAdminClient.users.delFromFederatedIdentity({
        id: currentUser.id,
        federatedIdentityId: 'foobar',
      });

      const federatedIdentities = await kcAdminClient.users.listFederatedIdentities(
        {
          id: currentUser.id,
        },
      );
      expect(federatedIdentities).to.be.eql([]);
    });
  });
});
