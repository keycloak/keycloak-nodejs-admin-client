// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import ClientRepresentation from '../src/defs/clientRepresentation';
import ProtocolMapperRepresentation from '../src/defs/protocolMapperRepresentation';
import ClientScopeRepresentation from '../src/defs/clientScopeRepresentation';
const expect = chai.expect;

describe('Clients', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentClient: ClientRepresentation;
  let currentClientScope: ClientScopeRepresentation;
  let currentRoleName: string;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);

    // create client and also test it
    // NOTICE: to be clear, clientId stands for the property `clientId` of client
    // clientUniqueId stands for property `id` of client
    const clientId = faker.internet.userName();
    const createdClient = await kcAdminClient.clients.create({
      clientId,
    });
    expect(createdClient.id).to.be.ok;

    const client = await kcAdminClient.clients.findOne({
      id: createdClient.id,
    });
    expect(client).to.be.ok;
    currentClient = client;
  });

  after(async () => {
    // delete the current one
    await kcAdminClient.clients.del({
      id: currentClient.id,
    });
  });

  it('list clients', async () => {
    const clients = await kcAdminClient.clients.find();
    expect(clients).to.be.ok;
  });

  it('get single client', async () => {
    const clientUniqueId = currentClient.id;
    const client = await kcAdminClient.clients.findOne({
      id: clientUniqueId,
    });
    // not sure why entity from list api will not have property: authorizationServicesEnabled
    expect(client).to.deep.include(currentClient);
  });

  it('update single client', async () => {
    const {clientId, id: clientUniqueId} = currentClient;
    await kcAdminClient.clients.update(
      {id: clientUniqueId},
      {
        // clientId is required in client update. no idea why...
        clientId,
        description: 'test',
      },
    );

    const client = await kcAdminClient.clients.findOne({
      id: clientUniqueId,
    });
    expect(client).to.include({
      description: 'test',
    });
  });

  it('delete single client', async () => {
    // create another one for delete test
    const clientId = faker.internet.userName();
    const {id} = await kcAdminClient.clients.create({
      clientId,
    });

    // delete it
    await kcAdminClient.clients.del({
      id,
    });

    const delClient = await kcAdminClient.clients.findOne({
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
      } = await kcAdminClient.clients.createRole({
        id: currentClient.id,
        name: roleName,
      });

      expect(createdRoleName).to.be.equal(roleName);

      // assign currentClientRole
      currentRoleName = roleName;
    });

    after(async () => {
      // delete client role
      await kcAdminClient.clients.delRole({
        id: currentClient.id,
        roleName: currentRoleName,
      });
    });

    it('list the client roles', async () => {
      const roles = await kcAdminClient.clients.listRoles({
        id: currentClient.id,
      });

      expect(roles[0]).to.include({
        name: currentRoleName,
      });
    });

    it('find the client role', async () => {
      const role = await kcAdminClient.clients.findRole({
        id: currentClient.id,
        roleName: currentRoleName,
      });

      expect(role).to.include({
        name: currentRoleName,
        clientRole: true,
        containerId: currentClient.id,
      });
    });

    it('update the client role', async () => {
      // NOTICE: roleName MUST be in the payload, no idea why...
      const delta = {
        name: currentRoleName,
        description: 'test',
      };
      await kcAdminClient.clients.updateRole(
        {
          id: currentClient.id,
          roleName: currentRoleName,
        },
        delta,
      );

      // check the change
      const role = await kcAdminClient.clients.findRole({
        id: currentClient.id,
        roleName: currentRoleName,
      });

      expect(role).to.include(delta);
    });

    it('delete a client role', async () => {
      const roleName = faker.internet.userName();
      // create a client role
      await kcAdminClient.clients.createRole({
        id: currentClient.id,
        name: roleName,
      });

      // delete
      await kcAdminClient.clients.delRole({
        id: currentClient.id,
        roleName,
      });

      // check it's null
      const role = await kcAdminClient.clients.findRole({
        id: currentClient.id,
        roleName,
      });

      expect(role).to.be.null;
    });
  });

  describe('client secret', () => {
    before(async () => {
      const {clientId, id: clientUniqueId} = currentClient;
      // update with serviceAccountsEnabled: true
      await kcAdminClient.clients.update(
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
      const credential = await kcAdminClient.clients.getClientSecret({
        id: currentClient.id,
      });

      expect(credential).to.have.all.keys('type', 'value');
    });

    it('generate new client secret', async () => {
      const newCredential = await kcAdminClient.clients.generateNewClientSecret(
        {
          id: currentClient.id,
        },
      );

      const credential = await kcAdminClient.clients.getClientSecret({
        id: currentClient.id,
      });

      expect(newCredential).to.be.eql(credential);
    });

    it('generate new registration access token', async () => {
      const newRegistrationAccessToken = await kcAdminClient.clients.generateRegistrationAccessToken(
        {
          id: currentClient.id,
        },
      );

      expect(newRegistrationAccessToken).to.be.ok;
    });

    it('get installation providers', async () => {
      const installationProvider = await kcAdminClient.clients.getInstallationProviders(
        {id: currentClient.id, providerId: 'keycloak-oidc-jboss-subsystem'},
      );
      expect(installationProvider).to.be.ok;
      expect(typeof installationProvider).to.be.equal('string');
    });

    it('get service account user', async () => {
      const serviceAccountUser = await kcAdminClient.clients.getServiceAccountUser(
        {
          id: currentClient.id,
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
        description: 'Oh - seems like you are reading  Hey there!',
        protocol: 'openid-connect',
      };

      // setup dummy client scope
      await kcAdminClient.clientScopes.create(dummyClientScope);
      currentClientScope = await kcAdminClient.clientScopes.findOneByName({
        name: dummyClientScope.name,
      });
    });

    afterEach(async () => {
      // cleanup default scopes
      try {
        const {id} = currentClient;
        const {id: clientScopeId} = currentClientScope;
        await kcAdminClient.clients.delDefaultClientScope({
          clientScopeId,
          id,
        });
      } catch (e) {
        // ignore
      }

      // cleanup client scopes
      try {
        await kcAdminClient.clientScopes.delByName({
          name: dummyClientScope.name,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list default client scopes', async () => {
      const defaultClientScopes = await kcAdminClient.clients.listDefaultClientScopes(
        {id: currentClient.id},
      );

      expect(defaultClientScopes).to.be.ok;
    });

    it('add default client scope', async () => {
      const {id} = currentClient;
      const {id: clientScopeId} = currentClientScope;

      await kcAdminClient.clients.addDefaultClientScope({
        id,
        clientScopeId,
      });

      const defaultScopes = await kcAdminClient.clients.listDefaultClientScopes(
        {id},
      );

      expect(defaultScopes).to.be.ok;

      const clientScope = defaultScopes.find(
        (scope) => scope.id === clientScopeId,
      );
      expect(clientScope).to.be.ok;
    });

    it('delete default client scope', async () => {
      const {id} = currentClient;
      const {id: clientScopeId} = currentClientScope;

      await kcAdminClient.clients.addDefaultClientScope({
        id,
        clientScopeId,
      });

      await kcAdminClient.clients.delDefaultClientScope({
        id,
        clientScopeId,
      });
      const defaultScopes = await kcAdminClient.clients.listDefaultClientScopes(
        {id},
      );

      const clientScope = defaultScopes.find(
        (scope) => scope.id === clientScopeId,
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
      await kcAdminClient.clientScopes.create(dummyClientScope);
      currentClientScope = await kcAdminClient.clientScopes.findOneByName({
        name: dummyClientScope.name,
      });
    });

    afterEach(async () => {
      // cleanup optional scopes
      try {
        const {id} = currentClient;
        const {id: clientScopeId} = currentClientScope;
        await kcAdminClient.clients.delOptionalClientScope({
          clientScopeId,
          id,
        });
      } catch (e) {
        // ignore
      }

      // cleanup client scopes
      try {
        await kcAdminClient.clientScopes.delByName({
          name: dummyClientScope.name,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list optional client scopes', async () => {
      const optionalClientScopes = await kcAdminClient.clients.listOptionalClientScopes(
        {id: currentClient.id},
      );

      expect(optionalClientScopes).to.be.ok;
    });

    it('add optional client scope', async () => {
      const {id} = currentClient;
      const {id: clientScopeId} = currentClientScope;

      await kcAdminClient.clients.addOptionalClientScope({
        id,
        clientScopeId,
      });

      const optionalScopes = await kcAdminClient.clients.listOptionalClientScopes(
        {id},
      );

      expect(optionalScopes).to.be.ok;

      const clientScope = optionalScopes.find(
        (scope) => scope.id === clientScopeId,
      );
      expect(clientScope).to.be.ok;
    });

    it('delete optional client scope', async () => {
      const {id} = currentClient;
      const {id: clientScopeId} = currentClientScope;

      await kcAdminClient.clients.addOptionalClientScope({
        id,
        clientScopeId,
      });

      await kcAdminClient.clients.delOptionalClientScope({
        id,
        clientScopeId,
      });
      const optionalScopes = await kcAdminClient.clients.listOptionalClientScopes(
        {id},
      );

      const clientScope = optionalScopes.find(
        (scope) => scope.id === clientScopeId,
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
        const {id: clientUniqueId} = currentClient;
        const {
          id: mapperId,
        } = await kcAdminClient.clients.findProtocolMapperByName({
          id: clientUniqueId,
          name: dummyMapper.name,
        });
        await kcAdminClient.clients.delProtocolMapper({
          id: clientUniqueId,
          mapperId,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list protocol mappers', async () => {
      const {id} = currentClient;
      const mapperList = await kcAdminClient.clients.listProtocolMappers({
        id,
      });
      expect(mapperList).to.be.ok;
    });

    it('add multiple protocol mappers', async () => {
      const {id} = currentClient;
      await kcAdminClient.clients.addMultipleProtocolMappers({id}, [
        dummyMapper,
      ]);

      const mapper = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });
      expect(mapper).to.be.ok;
      expect(mapper.protocol).to.eq(dummyMapper.protocol);
      expect(mapper.protocolMapper).to.eq(dummyMapper.protocolMapper);
    });

    it('add single protocol mapper', async () => {
      const {id} = currentClient;
      await kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const mapper = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });
      expect(mapper).to.be.ok;
      expect(mapper.protocol).to.eq(dummyMapper.protocol);
      expect(mapper.protocolMapper).to.eq(dummyMapper.protocolMapper);
    });

    it('find protocol mapper by id', async () => {
      const {id} = currentClient;
      await kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const {
        id: mapperId,
      } = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      const mapper = await kcAdminClient.clients.findProtocolMapperById({
        mapperId,
        id,
      });

      expect(mapper).to.be.ok;
      expect(mapper.id).to.eql(mapperId);
    });

    it('find protocol mapper by name', async () => {
      const {id} = currentClient;
      await kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const mapper = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      expect(mapper).to.be.ok;
      expect(mapper.name).to.eql(dummyMapper.name);
    });

    it('find protocol mappers by protocol', async () => {
      const {id} = currentClient;
      await kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const mapperList = await kcAdminClient.clients.findProtocolMappersByProtocol(
        {
          id,
          protocol: dummyMapper.protocol,
        },
      );

      expect(mapperList).to.be.ok;
      expect(mapperList.length).to.be.gte(1);

      const mapper = mapperList.find((item) => item.name === dummyMapper.name);
      expect(mapper).to.be.ok;
    });

    it('update protocol mapper', async () => {
      const {id} = currentClient;

      dummyMapper.config = {'access.token.claim': 'true'};
      await kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);
      const mapper = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      expect(mapper.config['access.token.claim']).to.eq('true');

      mapper.config = {'access.token.claim': 'false'};

      await kcAdminClient.clients.updateProtocolMapper(
        {id, mapperId: mapper.id},
        mapper,
      );

      const updatedMapper = await kcAdminClient.clients.findProtocolMapperByName(
        {
          id,
          name: dummyMapper.name,
        },
      );

      expect(updatedMapper.config['access.token.claim']).to.eq('false');
    });

    it('delete protocol mapper', async () => {
      const {id} = currentClient;
      await kcAdminClient.clients.addProtocolMapper({id}, dummyMapper);

      const {
        id: mapperId,
      } = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      await kcAdminClient.clients.delProtocolMapper({id, mapperId});

      const mapper = await kcAdminClient.clients.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      expect(mapper).not.to.be.ok;
    });
  });

  describe('scope mappings', () => {
    it('list client and realm scope mappings', async () => {
      const {id} = currentClient;
      const scopes = await kcAdminClient.clients.listScopeMappings({
        id,
      });
      expect(scopes).to.be.ok;
    });

    describe('client', () => {
      const dummyRoleName = 'clientScopeMappingsRole-dummy';

      beforeEach(async () => {
        const {id} = currentClient;
        await kcAdminClient.clients.createRole({
          id,
          name: dummyRoleName,
        });
      });

      afterEach(async () => {
        try {
          const {id} = currentClient;
          await kcAdminClient.clients.delRole({
            id,
            roleName: dummyRoleName,
          });
        } catch (e) {
          // ignore
        }
      });

      it('add scope mappings', async () => {
        const {id: clientUniqueId} = currentClient;

        const availableRoles = await kcAdminClient.clients.listAvailableClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );

        await kcAdminClient.clients.addClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
          availableRoles,
        );

        const roles = await kcAdminClient.clients.listClientScopeMappings({
          id: clientUniqueId,
          client: clientUniqueId,
        });

        expect(roles).to.be.ok;
        expect(roles).to.be.eql(availableRoles);
      });

      it('list scope mappings', async () => {
        const {id: clientUniqueId} = currentClient;
        const roles = await kcAdminClient.clients.listClientScopeMappings({
          id: clientUniqueId,
          client: clientUniqueId,
        });
        expect(roles).to.be.ok;
      });

      it('list available scope mappings', async () => {
        const {id: clientUniqueId} = currentClient;
        const roles = await kcAdminClient.clients.listAvailableClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('list composite scope mappings', async () => {
        const {id: clientUniqueId} = currentClient;
        const roles = await kcAdminClient.clients.listCompositeClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('delete scope mappings', async () => {
        const {id: clientUniqueId} = currentClient;

        const rolesBefore = await kcAdminClient.clients.listClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
        );

        await kcAdminClient.clients.delClientScopeMappings(
          {
            id: clientUniqueId,
            client: clientUniqueId,
          },
          rolesBefore,
        );

        const rolesAfter = await kcAdminClient.clients.listClientScopeMappings({
          id: clientUniqueId,
          client: clientUniqueId,
        });

        expect(rolesAfter).to.be.ok;
        expect(rolesAfter).to.eql([]);
      });

      it('get effective scope mapping of all roles for a specific container', async () => {
        const {id: clientUniqueId} = currentClient;
        const roles = await kcAdminClient.clients.evaluatePermission({
          id: clientUniqueId,
          roleContainer: 'master',
          type: 'granted',
          scope: 'openid',
        });

        expect(roles).to.be.ok;
        expect(roles.length).to.be.eq(4);
      });

      it('get list of all protocol mappers', async () => {
        const {id: clientUniqueId} = currentClient;
        const protocolMappers = await kcAdminClient.clients.evaluateListProtocolMapper(
          {
            id: clientUniqueId,
            scope: 'openid',
          },
        );
        expect(protocolMappers).to.be.ok;
        expect(protocolMappers.length).to.be.gt(10);
      });

      it('get JSON with payload of example access token', async () => {
        const {id: clientUniqueId} = currentClient;
        const username = faker.internet.userName();
        const user = await kcAdminClient.users.create({
          username,
        });
        const accessToken = await kcAdminClient.clients.evaluateGenerateAccessToken(
          {
            id: clientUniqueId,
            userId: user.id,
            scope: 'openid',
          },
        );

        expect(accessToken).to.be.ok;
        await kcAdminClient.users.del({id: user.id});
      });
    });

    describe('realm', () => {
      const dummyRoleName = 'realmScopeMappingsRole-dummy';

      beforeEach(async () => {
        await kcAdminClient.roles.create({
          name: dummyRoleName,
        });
      });

      afterEach(async () => {
        try {
          await kcAdminClient.roles.delByName({
            name: dummyRoleName,
          });
        } catch (e) {
          // ignore
        }
      });

      it('add scope mappings', async () => {
        const {id} = currentClient;

        const availableRoles = await kcAdminClient.clients.listAvailableRealmScopeMappings(
          {id},
        );

        await kcAdminClient.clients.addRealmScopeMappings({id}, availableRoles);

        const roles = await kcAdminClient.clients.listRealmScopeMappings({
          id,
        });

        expect(roles).to.be.ok;
        expect(roles).to.deep.members(availableRoles);
      });

      it('list scope mappings', async () => {
        const {id} = currentClient;
        const roles = await kcAdminClient.clients.listRealmScopeMappings({
          id,
        });
        expect(roles).to.be.ok;
      });

      it('list available scope mappings', async () => {
        const {id} = currentClient;
        const roles = await kcAdminClient.clients.listAvailableRealmScopeMappings(
          {id},
        );
        expect(roles).to.be.ok;
      });

      it('list composite scope mappings', async () => {
        const {id} = currentClient;
        const roles = await kcAdminClient.clients.listCompositeRealmScopeMappings(
          {id},
        );
        expect(roles).to.be.ok;
      });

      it('delete scope mappings', async () => {
        const {id} = currentClient;

        const rolesBefore = await kcAdminClient.clients.listRealmScopeMappings({
          id,
        });

        await kcAdminClient.clients.delRealmScopeMappings({id}, rolesBefore);

        const rolesAfter = await kcAdminClient.clients.listRealmScopeMappings({
          id,
        });

        expect(rolesAfter).to.be.ok;
        expect(rolesAfter).to.eql([]);
      });
    });
  });

  describe('sessions', () => {
    it('list clients user sessions', async () => {
      const clientUniqueId = currentClient.id;
      const userSessions = await kcAdminClient.clients.listSessions({
        id: clientUniqueId,
      });
      expect(userSessions).to.be.ok;
    });

    it('list clients offline user sessions', async () => {
      const clientUniqueId = currentClient.id;
      const userSessions = await kcAdminClient.clients.listOfflineSessions({
        id: clientUniqueId,
      });
      expect(userSessions).to.be.ok;
    });

    it('list clients user session count', async () => {
      const clientUniqueId = currentClient.id;
      const userSessions = await kcAdminClient.clients.getSessionCount({
        id: clientUniqueId,
      });
      expect(userSessions).to.be.ok;
    });

    it('list clients offline user session count', async () => {
      const clientUniqueId = currentClient.id;
      const userSessions = await kcAdminClient.clients.getOfflineSessionCount({
        id: clientUniqueId,
      });
      expect(userSessions).to.be.ok;
    });
  });

  describe('nodes', () => {
    const host = '127.0.0.1';
    it('register a node manually', async () => {
      await kcAdminClient.clients.addClusterNode({id: currentClient.id, node: host});
      const client = await kcAdminClient.clients.findOne({id: currentClient.id});

      expect(Object.keys(client.registeredNodes)).to.be.eql([host]);
    });

    it('remove registered host', async () => {
      await kcAdminClient.clients.deleteClusterNode({id: currentClient.id, node: host});
      const client = await kcAdminClient.clients.findOne({id: currentClient.id});

      expect(client.registeredNodes).to.be.undefined;
    });
  });
});
