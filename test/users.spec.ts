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
import GroupRepresentation from '../src/defs/groupRepresentation';
import {fail} from 'assert';

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
      attributes: {
        key: 'value',
      },
    });

    expect(user.id).to.be.ok;
    currentUser = (await kcAdminClient.users.findOne({id: user.id}))!;

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
      id: userId!,
    });

    const user = await kcAdminClient.users.findOne({
      id: userId!,
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
    const numUsers = await kcAdminClient.users.count({
      email: 'wwwy3y3@canner.io',
    });
    expect(numUsers).to.equal(1);
  });

  it('find users by custom attributes', async () => {
    // Searching by attributes is only available from Keycloak > 15
    const users = await kcAdminClient.users.find({key: 'value'});
    expect(users.length).to.be.equal(2);
    expect(users[0]).to.be.deep.include(currentUser);
  });

  it('get single users', async () => {
    const userId = currentUser.id;
    const user = await kcAdminClient.users.findOne({
      id: userId!,
    });
    expect(user).to.be.deep.include(currentUser);
  });

  it('update single users', async () => {
    const userId = currentUser.id;
    await kcAdminClient.users.update(
      {id: userId!},
      {
        firstName: 'william',
        lastName: 'chang',
        requiredActions: [RequiredActionAlias.UPDATE_PASSWORD],
        emailVerified: true,
      },
    );

    const user = await kcAdminClient.users.findOne({
      id: userId!,
    });
    expect(user).to.deep.include({
      firstName: 'william',
      lastName: 'chang',
      requiredActions: [RequiredActionAlias.UPDATE_PASSWORD],
      emailVerified: true,
    });
  });

  /**
   * execute actions email
   */
  it('should send user execute actions email', async () => {
    if (process.env.CI) return; // not possible inside CI
    const userId = currentUser.id;
    await kcAdminClient.users.executeActionsEmail({
      id: userId!,
      lifespan: 43200,
      actions: [RequiredActionAlias.UPDATE_PASSWORD],
    });
  });

  /**
   * reset password
   */

  it('should reset user password', async () => {
    const userId = currentUser.id;
    await kcAdminClient.users.resetPassword({
      id: userId!,
      credential: {
        temporary: false,
        type: 'password',
        value: 'test',
      },
    });
  });

  /**
   * get user credentials
   */
  it('get user credentials', async () => {
    const userId = currentUser.id;
    const credentials = await kcAdminClient.users.getCredentials({
      id: userId!,
    });

    expect(credentials.map(c => c.type)).to.include('password')
  });

  /**
   * delete user credentials
   */
  it('delete user credentials', async () => {
    const userId = currentUser.id;
    const credentials = await kcAdminClient.users.getCredentials({
      id: userId!,
    });

    expect(credentials.map(c => c.type)).to.include('password')

    const credential = credentials[0];
    await kcAdminClient.users.deleteCredential({
      id: userId!,
      credentialId: credential.id!,
    });

    const credentialsAfterDelete = await kcAdminClient.users.getCredentials({
      id: userId!,
    });

    expect(credentialsAfterDelete).to.not.deep.include(credential);

    // Add deleted password back
    await kcAdminClient.users.resetPassword({
      id: userId!,
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
    if (process.env.CI) return; // not possible inside CI

    const userId = currentUser.id;
    await kcAdminClient.users.sendVerifyEmail({
      id: userId!,
    });
  });

  /**
   * Groups
   */
  describe('user groups', () => {
    let currentGroup: GroupRepresentation;
    before(async () => {
      const group = await kcAdminClient.groups.create({
        name: 'cool-group',
      });
      expect(group.id).to.be.ok;
      currentGroup = (await kcAdminClient.groups.findOne({id: group.id}))!;
    });

    after(async () => {
      const groupId = currentGroup.id;
      const groups = await kcAdminClient.groups.find({max: 100});
      await Promise.all(
        groups.map((_group: GroupRepresentation) => {
          return kcAdminClient.groups.del({id: _group.id!});
        }),
      );

      const group = await kcAdminClient.groups.findOne({
        id: groupId!,
      });
      expect(group).to.be.null;
    });

    it('add group', async () => {
      let count = (await kcAdminClient.users.countGroups({id: currentUser.id!}))
        .count;
      expect(count).to.eq(0);
      await kcAdminClient.users.addToGroup({
        groupId: currentGroup.id!,
        id: currentUser.id!,
      });
      count = (await kcAdminClient.users.countGroups({id: currentUser.id!}))
        .count;
      expect(count).to.eq(1);
    });

    it('count groups', async () => {
      let {count} = await kcAdminClient.users.countGroups({id: currentUser.id!});
      expect(count).to.eq(1);

      count = (
        await kcAdminClient.users.countGroups({
          id: currentUser.id!,
          search: 'cool-group',
        })
      ).count;
      expect(count).to.eq(1);

      count = (
        await kcAdminClient.users.countGroups({
          id: currentUser.id!,
          search: 'fake-group',
        })
      ).count;
      expect(count).to.eq(0);
    });

    it('list groups', async () => {
      const groups = await kcAdminClient.users.listGroups({id: currentUser.id!});
      expect(groups).to.be.ok;
      expect(groups.length).to.be.eq(1);
      expect(groups[0].name).to.eq('cool-group');
    });

    it('remove group', async () => {
      const newGroup = await kcAdminClient.groups.create({name: 'test-group'});
      await kcAdminClient.users.addToGroup({
        id: currentUser.id!,
        groupId: newGroup.id,
      });
      let count = (await kcAdminClient.users.countGroups({id: currentUser.id!}))
        .count;
      expect(count).to.eq(2);

      try {
        await kcAdminClient.users.delFromGroup({
          id: currentUser.id!,
          groupId: newGroup.id,
        });
      } catch (e) {
        fail('Didn\'t expect an error when deleting a valid group id');
      }

      count = (await kcAdminClient.users.countGroups({id: currentUser.id!}))
        .count;
      expect(count).to.equal(1);

      await kcAdminClient.groups.del({id: newGroup.id});

      // delete a non-existing group should throw an error
      try {
        await kcAdminClient.users.delFromGroup({
          id: currentUser.id!,
          groupId: 'fake-group-id',
        });
        fail(
          'Expected an error when deleting a fake id not assigned to the user',
        );
      } catch (e) {
        expect(e).to.be.ok;
      }
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
      currentRole = role!;
    });

    after(async () => {
      await kcAdminClient.roles.delByName({name: currentRole.name!});
    });

    it('add a role to user', async () => {
      // add role-mappings with role id
      await kcAdminClient.users.addRealmRoleMappings({
        id: currentUser.id!,

        // at least id and name should appear
        roles: [
          {
            id: currentRole.id!,
            name: currentRole.name!,
          },
        ],
      });
    });

    it('list available role-mappings for user', async () => {
      const roles = await kcAdminClient.users.listAvailableRealmRoleMappings({
        id: currentUser.id!,
      });

      // admin, create-realm
      // not sure why others like offline_access, uma_authorization not included
      expect(roles.length).to.be.least(2);
    });

    it('list role-mappings of user', async () => {
      const res = await kcAdminClient.users.listRoleMappings({
        id: currentUser.id!,
      });

      expect(res).have.all.keys('realmMappings');
    });

    it('list realm role-mappings of user', async () => {
      const roles = await kcAdminClient.users.listRealmRoleMappings({
        id: currentUser.id!,
      });
      // currentRole will have an empty `attributes`, but role-mappings do not
      expect(roles).to.deep.include(omit(currentRole, 'attributes'));
    });

    it('list realm composite role-mappings of user', async () => {
      const roles = await kcAdminClient.users.listCompositeRealmRoleMappings({
        id: currentUser.id!,
      });
      // todo: add data integrity check later
      expect(roles).to.be.ok;
    });

    it('del realm role-mappings from user', async () => {
      await kcAdminClient.users.delRealmRoleMappings({
        id: currentUser.id!,
        roles: [
          {
            id: currentRole.id!,
            name: currentRole.name!,
          },
        ],
      });

      const roles = await kcAdminClient.users.listRealmRoleMappings({
        id: currentUser.id!,
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
        id: currentClient.id!,
        roleName,
      });
    });

    after(async () => {
      await kcAdminClient.clients.delRole({
        id: currentClient.id!,
        roleName: currentRole.name!,
      });
      await kcAdminClient.clients.del({id: currentClient.id!});
    });

    it('add a client role to user', async () => {
      // add role-mappings with role id
      await kcAdminClient.users.addClientRoleMappings({
        id: currentUser.id!,
        clientUniqueId: currentClient.id!,

        // at least id and name should appear
        roles: [
          {
            id: currentRole.id!,
            name: currentRole.name!,
          },
        ],
      });
    });

    it('list available client role-mappings for user', async () => {
      const roles = await kcAdminClient.users.listAvailableClientRoleMappings({
        id: currentUser.id!,
        clientUniqueId: currentClient.id!,
      });

      expect(roles).to.be.empty;
    });

    it('list composite client role-mappings for user', async () => {
      const roles = await kcAdminClient.users.listCompositeClientRoleMappings({
        id: currentUser.id!,
        clientUniqueId: currentClient.id!,
      });

      expect(roles).to.be.ok;
    });

    it('list client role-mappings of user', async () => {
      const roles = await kcAdminClient.users.listClientRoleMappings({
        id: currentUser.id!,
        clientUniqueId: currentClient.id!,
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
        id: currentClient.id!,
        roleName,
      });

      // delete the created role
      await kcAdminClient.users.delClientRoleMappings({
        id: currentUser.id!,
        clientUniqueId: currentClient.id!,
        roles: [
          {
            id: role.id!,
            name: role.name!,
          },
        ],
      });

      // check if mapping is successfully deleted
      const roles = await kcAdminClient.users.listClientRoleMappings({
        id: currentUser.id!,
        clientUniqueId: currentClient.id!,
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
        id: currentClient.id!,
      });
    });

    it('list user sessions', async () => {
      // @TODO: In order to test it, currentUser has to be logged in
      const userSessions = await kcAdminClient.users.listSessions({
        id: currentUser.id!,
      });

      expect(userSessions).to.be.ok;
    });

    it('list users off-line sessions', async () => {
      // @TODO: In order to test it, currentUser has to be logged in
      const userOfflineSessions = await kcAdminClient.users.listOfflineSessions(
        {id: currentUser.id!, clientId: currentClient.id!},
      );

      expect(userOfflineSessions).to.be.ok;
    });

    it('logout user from all sessions', async () => {
      // @TODO: In order to test it, currentUser has to be logged in
      await kcAdminClient.users.logout({id: currentUser.id!});
    });

    it('list consents granted by the user', async () => {
      const consents = await kcAdminClient.users.listConsents({
        id: currentUser.id!,
      });

      expect(consents).to.be.ok;
    });

    it('revoke consent and offline tokens for particular client', async () => {
      // @TODO: In order to test it, currentUser has to granted consent to client
      const consents = await kcAdminClient.users.listConsents({
        id: currentUser.id!,
      });

      if (consents.length) {
        const consent = consents[0];

        await kcAdminClient.users.revokeConsent({
          id: currentUser.id!,
          clientId: consent.clientId!,
        });
      }
    });

    it('impersonate user', async () => {
      const result = await kcAdminClient.users.impersonation(
        {id: currentUser.id!},
        {user: currentUser.id!, realm: kcAdminClient.realmName},
      );
      expect(result).to.be.ok;
      await kcAdminClient.auth(credentials);
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

    it('should list user federated identities and expect empty', async () => {
      const federatedIdentities = await kcAdminClient.users.listFederatedIdentities(
        {
          id: currentUser.id!,
        },
      );
      expect(federatedIdentities).to.be.eql([]);
    });

    it('should add federated identity to user', async () => {
      await kcAdminClient.users.addToFederatedIdentity({
        id: currentUser.id!,
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
        id: currentUser.id!,
        federatedIdentityId: 'foobar',
      });

      const federatedIdentities = await kcAdminClient.users.listFederatedIdentities(
        {
          id: currentUser.id!,
        },
      );
      expect(federatedIdentities).to.be.eql([]);
    });
  });
});
