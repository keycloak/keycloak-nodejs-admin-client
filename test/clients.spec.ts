// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import ClientRepresentation from '../src/defs/clientRepresentation';
import ProtocolMapperRepresentation from '../src/defs/protocolMapperRepresentation';
import ClientScopeRepresentation from '../src/defs/clientScopeRepresentation';
import {DecisionStrategy, Logic} from '../src/defs/policyRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';
const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentClient?: ClientRepresentation;
    currentClientScope?: ClientScopeRepresentation;
    currentRoleName?: string;
    currentGroup?: GroupRepresentation;
    currentPolicyId?: string;
    currentPermissionId?: string;
  }
}

describe('Clients', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);

    // create client and also test it
    // NOTICE: to be clear, clientId stands for the property `clientId` of client
    // clientUniqueId stands for property `id` of client
    const clientId = faker.internet.userName();
    const createdClient = await this.kcAdminClient.clients.create({
      clientId,
    });
    expect(createdClient.id).to.be.ok;

    const client = await this.kcAdminClient.clients.findOne({
      id: createdClient.id,
    });
    expect(client).to.be.ok;
    this.currentClient = client;
  });

  after(async () => {
    // delete the current one
    await this.kcAdminClient.clients.del({
      id: this.currentClient.id,
    });
  });

  it('list clients', async () => {
    const clients = await this.kcAdminClient.clients.find();
    expect(clients).to.be.ok;
  });

  it('get single client', async () => {
    const clientUniqueId = this.currentClient.id;
    const client = await this.kcAdminClient.clients.findOne({
      id: clientUniqueId,
    });
    // not sure why entity from list api will not have property: authorizationServicesEnabled
    expect(client).to.deep.include(this.currentClient);
  });

  it('update single client', async () => {
    const {clientId, id: clientUniqueId} = this.currentClient;
    await this.kcAdminClient.clients.update(
      {id: clientUniqueId},
      {
        // clientId is required in client update. no idea why...
        clientId,
        description: 'test',
      },
    );

    const client = await this.kcAdminClient.clients.findOne({
      id: clientUniqueId,
    });
    expect(client).to.include({
      description: 'test',
    });
  });

  it('delete single client', async () => {
    // create another one for delete test
    const clientId = faker.internet.userName();
    const {id} = await this.kcAdminClient.clients.create({
      clientId,
    });

    // delete it
    await this.kcAdminClient.clients.del({
      id,
    });

    const delClient = await this.kcAdminClient.clients.findOne({
      id,
    });
    expect(delClient).to.be.null;
  });

  /**
   * client roles
   */
  describe('client roles', () => {
    before(async () => {
      const roleName = faker.internet.userName();
      // create a client role
      const {
        roleName: createdRoleName,
      } = await this.kcAdminClient.clients.createRole({
        id: this.currentClient.id,
        name: roleName,
      });

      expect(createdRoleName).to.be.equal(roleName);

      // assign currentClientRole
      this.currentRoleName = roleName;
    });

    after(async () => {
      // delete client role
      await this.kcAdminClient.clients.delRole({
        id: this.currentClient.id,
        roleName: this.currentRoleName,
      });
    });

    it('list the client roles', async () => {
      const roles = await this.kcAdminClient.clients.listRoles({
        id: this.currentClient.id,
      });

      expect(roles[0]).to.include({
        name: this.currentRoleName,
      });
    });

    it('find the client role', async () => {
      const role = await this.kcAdminClient.clients.findRole({
        id: this.currentClient.id,
        roleName: this.currentRoleName,
      });

      expect(role).to.include({
        name: this.currentRoleName,
        clientRole: true,
        containerId: this.currentClient.id,
      });
    });

    it('update the client role', async () => {
      // NOTICE: roleName MUST be in the payload, no idea why...
      const delta = {
        name: this.currentRoleName,
        description: 'test',
      };
      await this.kcAdminClient.clients.updateRole(
        {
          id: this.currentClient.id,
          roleName: this.currentRoleName,
        },
        delta,
      );

      // check the change
      const role = await this.kcAdminClient.clients.findRole({
        id: this.currentClient.id,
        roleName: this.currentRoleName,
      });

      expect(role).to.include(delta);
    });

    it('delete a client role', async () => {
      const roleName = faker.internet.userName();
      // create a client role
      await this.kcAdminClient.clients.createRole({
        id: this.currentClient.id,
        name: roleName,
      });

      // delete
      await this.kcAdminClient.clients.delRole({
        id: this.currentClient.id,
        roleName,
      });

      // check it's null
      const role = await this.kcAdminClient.clients.findRole({
        id: this.currentClient.id,
        roleName,
      });

      expect(role).to.be.null;
    });
  });

  describe('client secret', () => {
    before(async () => {
      const {clientId, id: clientUniqueId} = this.currentClient;
      // update with serviceAccountsEnabled: true
      await this.kcAdminClient.clients.update(
        {
          id: clientUniqueId,
        },
        {
          clientId,
          serviceAccountsEnabled: true,
        },
      );
    });

    it('get client secret', async () => {
      const credential = await this.kcAdminClient.clients.getClientSecret({
        id: this.currentClient.id,
      });

      expect(credential).to.have.all.keys('type', 'value');
    });

    it('generate new client secret', async () => {
      const newCredential = await this.kcAdminClient.clients.generateNewClientSecret(
        {
          id: this.currentClient.id,
        },
      );

      const credential = await this.kcAdminClient.clients.getClientSecret({
        id: this.currentClient.id,
      });

      expect(newCredential).to.be.eql(credential);
    });

    it('get service account user', async () => {
      const serviceAccountUser = await this.kcAdminClient.clients.getServiceAccountUser(
        {
          id: this.currentClient.id,
        },
      );

      expect(serviceAccountUser).to.be.ok;
    });
  });

  describe('default client scopes', () => {
    let dummyClientScope;

    beforeEach(async () => {
      dummyClientScope = {
        name: 'does-anyone-read-this',
        description: 'Oh - seems like you are reading this. Hey there!',
        protocol: 'openid-connect',
      };

      // setup dummy client scope
      await this.kcAdminClient.clientScopes.create(dummyClientScope);
      this.currentClientScope = await this.kcAdminClient.clientScopes.findOneByName(
        {name: dummyClientScope.name},
      );
    });

    afterEach(async () => {
      // cleanup default scopes
      try {
        const {id} = this.currentClient;
        const {id: clientScopeId} = this.currentClientScope;
        await this.kcAdminClient.clients.delDefaultClientScope({
          clientScopeId,
          id,
        });
      } catch (e) {
        // ignore
      }

      // cleanup client scopes
      try {
        await this.kcAdminClient.clientScopes.delByName({
          name: dummyClientScope.name,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list default client scopes', async () => {
      const defaultClientScopes = await this.kcAdminClient.clients.listDefaultClientScopes(
        {id: this.currentClient.id},
      );

      expect(defaultClientScopes).to.be.ok;
    });

    it('add default client scope', async () => {
      const {id} = this.currentClient;
      const {id: clientScopeId} = this.currentClientScope;

      await this.kcAdminClient.clients.addDefaultClientScope({
        id,
        clientScopeId,
      });

      const defaultScopes = await this.kcAdminClient.clients.listDefaultClientScopes(
        {id},
      );

      expect(defaultScopes).to.be.ok;

      const clientScope = defaultScopes.find(
        scope => scope.id === clientScopeId,
      );
      expect(clientScope).to.be.ok;
    });

    it('delete default client scope', async () => {
      const {id} = this.currentClient;
      const {id: clientScopeId} = this.currentClientScope;

      await this.kcAdminClient.clients.addDefaultClientScope({
        id,
        clientScopeId,
      });

      await this.kcAdminClient.clients.delDefaultClientScope({
        id,
        clientScopeId,
      });
      const defaultScopes = await this.kcAdminClient.clients.listDefaultClientScopes(
        {id},
      );

      const clientScope = defaultScopes.find(
        scope => scope.id === clientScopeId,
      );
      expect(clientScope).not.to.be.ok;
    });
  });

  describe('optional client scopes', () => {
    let dummyClientScope;

    beforeEach(async () => {
      dummyClientScope = {
        name: 'i-hope-your-well',
        description: 'Everyone has that one friend.',
        protocol: 'openid-connect',
      };

      // setup dummy client scope
      await this.kcAdminClient.clientScopes.create(dummyClientScope);
      this.currentClientScope = await this.kcAdminClient.clientScopes.findOneByName(
        {name: dummyClientScope.name},
      );
    });

    afterEach(async () => {
      // cleanup optional scopes
      try {
        const {id} = this.currentClient;
        const {id: clientScopeId} = this.currentClientScope;
        await this.kcAdminClient.clients.delOptionalClientScope({
          clientScopeId,
          id,
        });
      } catch (e) {
        // ignore
      }

      // cleanup client scopes
      try {
        await this.kcAdminClient.clientScopes.delByName({
          name: dummyClientScope.name,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list optional client scopes', async () => {
      const optionalClientScopes = await this.kcAdminClient.clients.listOptionalClientScopes(
        {id: this.currentClient.id},
      );

      expect(optionalClientScopes).to.be.ok;
    });

    it('add optional client scope', async () => {
      const {id} = this.currentClient;
      const {id: clientScopeId} = this.currentClientScope;

      await this.kcAdminClient.clients.addOptionalClientScope({
        id,
        clientScopeId,
      });

      const optionalScopes = await this.kcAdminClient.clients.listOptionalClientScopes(
        {id},
      );

      expect(optionalScopes).to.be.ok;

      const clientScope = optionalScopes.find(
        scope => scope.id === clientScopeId,
      );
      expect(clientScope).to.be.ok;
    });

    it('delete optional client scope', async () => {
      const {id} = this.currentClient;
      const {id: clientScopeId} = this.currentClientScope;

      await this.kcAdminClient.clients.addOptionalClientScope({
        id,
        clientScopeId,
      });

      await this.kcAdminClient.clients.delOptionalClientScope({
        id,
        clientScopeId,
      });
      const optionalScopes = await this.kcAdminClient.clients.listOptionalClientScopes(
        {id},
      );

      const clientScope = optionalScopes.find(
        scope => scope.id === clientScopeId,
      );
      expect(clientScope).not.to.be.ok;
    });
  });

  describe('protocol mappers', () => {
    let dummyMapper: ProtocolMapperRepresentation;

    beforeEach(() => {
      dummyMapper = {
        name: 'become-a-farmer',
        protocol: 'openid-connect',
        protocolMapper: 'oidc-role-name-mapper',
        config: {
          role: 'admin',
          'new.role.name': 'farmer',
        },
      };
    });

    afterEach(async () => {
      try {
        const {id: clientUniqueId} = this.currentClient;
        const {
          id: mapperId,
        } = await this.kcAdminClient.clients.findProtocolMapperByName({
          id: clientUniqueId,
          name: dummyMapper.name,
        });
        await this.kcAdminClient.clients.delProtocolMapper({
          id: clientUniqueId,
          mapperId,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list protocol mappers', async () => {
      const {id} = this.currentClient;
      const mapperList = await this.kcAdminClient.clients.listProtocolMappers({
        id,
      });
      expect(mapperList).to.be.ok;
    });

    it('add multiple protocol mappers', async () => {
      const {id} = this.currentClient;
      await this.kcAdminClient.clients.addMultipleProtocolMappers({id}, [
        dummyMapper,
      ]);

      const mapper = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });
      expect(mapper).to.be.ok;
      expect(mapper.protocol).to.eq(dummyMapper.protocol);
      expect(mapper.protocolMapper).to.eq(dummyMapper.protocolMapper);
    });

    it('add single protocol mapper', async () => {
      const {id} = this.currentClient;
      await this.kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const mapper = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });
      expect(mapper).to.be.ok;
      expect(mapper.protocol).to.eq(dummyMapper.protocol);
      expect(mapper.protocolMapper).to.eq(dummyMapper.protocolMapper);
    });

    it('find protocol mapper by id', async () => {
      const {id} = this.currentClient;
      await this.kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const {
        id: mapperId,
      } = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      const mapper = await this.kcAdminClient.clients.findProtocolMapperById({
        mapperId,
        id,
      });

      expect(mapper).to.be.ok;
      expect(mapper.id).to.eql(mapperId);
    });

    it('find protocol mapper by name', async () => {
      const {id} = this.currentClient;
      await this.kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const mapper = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      expect(mapper).to.be.ok;
      expect(mapper.name).to.eql(dummyMapper.name);
    });

    it('find protocol mappers by protocol', async () => {
      const {id} = this.currentClient;
      await this.kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const mapperList = await this.kcAdminClient.clients.findProtocolMappersByProtocol(
        {
          id,
          protocol: dummyMapper.protocol,
        },
      );

      expect(mapperList).to.be.ok;
      expect(mapperList.length).to.be.gte(1);

      const mapper = mapperList.find(item => item.name === dummyMapper.name);
      expect(mapper).to.be.ok;
    });

    it('update protocol mapper', async () => {
      const {id} = this.currentClient;

      dummyMapper.config = {'access.token.claim': 'true'};
      await this.kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);
      const mapper = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      expect(mapper.config['access.token.claim']).to.eq('true');

      mapper.config = {'access.token.claim': 'false'};

      await this.kcAdminClient.clients.updateProtocolMapper(
        {id, mapperId: mapper.id},
        mapper,
      );

      const updatedMapper = await this.kcAdminClient.clients.findProtocolMapperByName(
        {
          id,
          name: dummyMapper.name,
        },
      );

      expect(updatedMapper.config['access.token.claim']).to.eq('false');
    });

    it('delete protocol mapper', async () => {
      const {id} = this.currentClient;
      await this.kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const {
        id: mapperId,
      } = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      await this.kcAdminClient.clients.delProtocolMapper({id, mapperId});

      const mapper = await this.kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      expect(mapper).not.to.be.ok;
    });
  });

  describe('scope mappings', () => {
    it('list client and realm scope mappings', async () => {
      const {id} = this.currentClient;
      const scopes = await this.kcAdminClient.clients.listScopeMappings({
        id,
      });
      expect(scopes).to.be.ok;
    });

    describe('client', () => {
      const dummyRoleName = 'clientScopeMappingsRole-dummy';

      beforeEach(async () => {
        const {id} = this.currentClient;
        await this.kcAdminClient.clients.createRole({
          id,
          name: dummyRoleName,
        });
      });

      afterEach(async () => {
        try {
          const {id} = this.currentClient;
          await this.kcAdminClient.clients.delRole({
            id,
            roleName: dummyRoleName,
          });
        } catch (e) {
          // ignore
        }
      });

      it('add scope mappings', async () => {
        const {id: clientUniqueId} = this.currentClient;

        const availableRoles = await this.kcAdminClient.clients.listAvailableClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );

        await this.kcAdminClient.clients.addClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
          availableRoles,
        );

        const roles = await this.kcAdminClient.clients.listClientScopeMappings({
          id: clientUniqueId,
          client: clientUniqueId,
        });

        expect(roles).to.be.ok;
        expect(roles).to.be.eql(availableRoles);
      });

      it('list scope mappings', async () => {
        const {id: clientUniqueId} = this.currentClient;
        const roles = await this.kcAdminClient.clients.listClientScopeMappings({
          id: clientUniqueId,
          client: clientUniqueId,
        });
        expect(roles).to.be.ok;
      });

      it('list available scope mappings', async () => {
        const {id: clientUniqueId} = this.currentClient;
        const roles = await this.kcAdminClient.clients.listAvailableClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('list composite scope mappings', async () => {
        const {id: clientUniqueId} = this.currentClient;
        const roles = await this.kcAdminClient.clients.listCompositeClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('delete scope mappings', async () => {
        const {id: clientUniqueId} = this.currentClient;

        const rolesBefore = await this.kcAdminClient.clients.listClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );

        await this.kcAdminClient.clients.delClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
          rolesBefore,
        );

        const rolesAfter = await this.kcAdminClient.clients.listClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );

        expect(rolesAfter).to.be.ok;
        expect(rolesAfter).to.eql([]);
      });
    });

    describe('realm', () => {
      const dummyRoleName = 'realmScopeMappingsRole-dummy';

      beforeEach(async () => {
        await this.kcAdminClient.roles.create({
          name: dummyRoleName,
        });
      });

      afterEach(async () => {
        try {
          await this.kcAdminClient.roles.delByName({
            name: dummyRoleName,
          });
        } catch (e) {
          // ignore
        }
      });

      it('add scope mappings', async () => {
        const {id} = this.currentClient;

        const availableRoles = await this.kcAdminClient.clients.listAvailableRealmScopeMappings(
          {id},
        );

        await this.kcAdminClient.clients.addRealmScopeMappings(
          {id},
          availableRoles,
        );

        const roles = await this.kcAdminClient.clients.listRealmScopeMappings({
          id,
        });

        expect(roles).to.be.ok;
        expect(roles).to.deep.members(availableRoles);
      });

      it('list scope mappings', async () => {
        const {id} = this.currentClient;
        const roles = await this.kcAdminClient.clients.listRealmScopeMappings({
          id,
        });
        expect(roles).to.be.ok;
      });

      it('list available scope mappings', async () => {
        const {id} = this.currentClient;
        const roles = await this.kcAdminClient.clients.listAvailableRealmScopeMappings(
          {id},
        );
        expect(roles).to.be.ok;
      });

      it('list composite scope mappings', async () => {
        const {id} = this.currentClient;
        const roles = await this.kcAdminClient.clients.listCompositeRealmScopeMappings(
          {id},
        );
        expect(roles).to.be.ok;
      });

      it('delete scope mappings', async () => {
        const {id} = this.currentClient;

        const rolesBefore = await this.kcAdminClient.clients.listRealmScopeMappings(
          {id},
        );

        await this.kcAdminClient.clients.delRealmScopeMappings(
          {id},
          rolesBefore,
        );

        const rolesAfter = await this.kcAdminClient.clients.listRealmScopeMappings(
          {id},
        );

        expect(rolesAfter).to.be.ok;
        expect(rolesAfter).to.eql([]);
      });
    });
  });

  describe('sessions', () => {
    it('list clients user sessions', async () => {
      const clientUniqueId = this.currentClient.id;
      const userSessions = await this.kcAdminClient.clients.listSessions({
        id: clientUniqueId,
      });
      expect(userSessions).to.be.ok;
    });

    it('list clients offline user sessions', async () => {
      const clientUniqueId = this.currentClient.id;
      const userSessions = await this.kcAdminClient.clients.listOfflineSessions(
        {
          id: clientUniqueId,
        },
      );
      expect(userSessions).to.be.ok;
    });

    it('list clients user session count', async () => {
      const clientUniqueId = this.currentClient.id;
      const userSessions = await this.kcAdminClient.clients.getSessionCount({
        id: clientUniqueId,
      });
      expect(userSessions).to.be.ok;
    });

    it('list clients offline user session count', async () => {
      const clientUniqueId = this.currentClient.id;
      const userSessions = await this.kcAdminClient.clients.getOfflineSessionCount(
        {
          id: clientUniqueId,
        },
      );
      expect(userSessions).to.be.ok;
    });
  });
});

describe('Authorization: Permission and Policy Management', () => {
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
    await this.kcAdminClient.realms.updateUsersManagementPermissions({
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
    this.currentPolicyId = policy.id;
  });

  it('should get group policy', async () => {
    const policy = await this.kcAdminClient.clients.getPolicy({
      id: this.currentClient.id,
      policyId: this.currentPolicyId,
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
      policies: [this.currentPolicyId],
    });
    expect(permission).to.be.ok;
    this.currentPermissionId = permission.id;
  });

  it('should get scope permission', async () => {
    const permission = await this.kcAdminClient.clients.getPermission({
      id: this.currentClient.id,
      type: 'scope',
      realm: this.currentRealm,
      permissionId: this.currentPermissionId,
    });
    expect(permission).to.be.ok;
  });

  it('should delete scope permission', async () => {
    await this.kcAdminClient.clients.deletePolicy({
      id: this.currentClient.id,
      policyId: this.currentPermissionId,
      realm: this.currentRealm,
    });
    const permission = await this.kcAdminClient.clients.getPermission({
      id: this.currentClient.id,
      type: 'scope',
      realm: this.currentRealm,
      permissionId: this.currentPermissionId,
    });
    expect(permission).to.be.null;
  });

  it('should delete group policy', async () => {
    await this.kcAdminClient.clients.deletePolicy({
      id: this.currentClient.id,
      policyId: this.currentPolicyId,
      realm: this.currentRealm,
    });
    const policy = await this.kcAdminClient.clients.getPolicy({
      id: this.currentClient.id,
      policyId: this.currentPolicyId,
      type: 'group',
      realm: this.currentRealm,
    });
    expect(policy).to.be.null;
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
