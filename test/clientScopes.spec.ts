// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import ClientScopeRepresentation from '../src/defs/clientScopeRepresentation';
import ProtocolMapperRepresentation from '../src/defs/protocolMapperRepresentation';
import ClientRepresentation from '../src/defs/clientRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentClientScope?: ClientScopeRepresentation;
    currentClientScopeName?: string;
    currentClient?: ClientRepresentation;
  }
}

describe('Client Scopes', () => {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);
  });

  beforeEach(async () => {
    this.currentClientScopeName = 'best-of-the-bests-scope';
    await this.kcAdminClient.clientScopes.create({
      name: this.currentClientScopeName,
    });
    this.currentClientScope = await this.kcAdminClient.clientScopes.findOneByName(
      {
        name: this.currentClientScopeName,
      },
    );
  });

  afterEach(async () => {
    // cleanup default client scopes
    try {
      await this.kcAdminClient.clientScopes.delDefaultClientScope({
        id: this.currentClientScope.id,
      });
    } catch (e) {
      // ignore
    }

    // cleanup optional client scopes
    try {
      await this.kcAdminClient.clientScopes.delDefaultOptionalClientScope({
        id: this.currentClientScope.id,
      });
    } catch (e) {
      // ignore
    }

    // cleanup client scopes
    try {
      await this.kcAdminClient.clientScopes.delByName({
        name: this.currentClientScopeName,
      });
    } catch (e) {
      // ignore
    }
  });

  it('list client scopes', async () => {
    const scopes = await this.kcAdminClient.clientScopes.find();
    expect(scopes).to.be.ok;
  });

  it('create client scope and get by name', async () => {
    // ensure that the scope does not exist
    try {
      await this.kcAdminClient.clientScopes.delByName({
        name: this.currentClientScopeName,
      });
    } catch (e) {
      // ignore
    }

    await this.kcAdminClient.clientScopes.create({
      name: this.currentClientScopeName,
    });

    const scope = await this.kcAdminClient.clientScopes.findOneByName({
      name: this.currentClientScopeName,
    });
    expect(scope).to.be.ok;
    expect(scope.name).to.equal(this.currentClientScopeName);
  });

  it('find scope by id', async () => {
    const scope = await this.kcAdminClient.clientScopes.findOneById({
      id: this.currentClientScope.id,
    });
    expect(scope).to.be.ok;
    expect(scope).to.eql(this.currentClientScope);
  });

  it('find scope by name', async () => {
    const scope = await this.kcAdminClient.clientScopes.findOneByName({
      name: this.currentClientScopeName,
    });
    expect(scope).to.be.ok;
    expect(scope.name).to.eql(this.currentClientScopeName);
  });

  it('return null if scope not found by id', async () => {
    const scope = await this.kcAdminClient.clientScopes.findOneById({
      id: 'I do not exist',
    });
    expect(scope).to.be.null;
  });

  it('return null if scope not found by name', async () => {
    const scope = await this.kcAdminClient.clientScopes.findOneByName({
      name: 'I do not exist',
    });
    expect(scope).to.be.null;
  });

  it('update client scope', async () => {
    const {id, description: oldDescription} = this.currentClientScope;
    const description = 'This scope is totally awesome.';

    await this.kcAdminClient.clientScopes.updateById({id}, {description});
    const updatedScope = await this.kcAdminClient.clientScopes.findOneById({
      id,
    });
    expect(updatedScope).to.be.ok;
    expect(updatedScope).not.to.eql(this.currentClientScope);
    expect(updatedScope.description).to.eq(description);
    expect(updatedScope.description).not.to.eq(oldDescription);
  });

  it('delete single client scope by id', async () => {
    await this.kcAdminClient.clientScopes.delById({
      id: this.currentClientScope.id,
    });
    const scope = await this.kcAdminClient.clientScopes.findOneById({
      id: this.currentClientScope.id,
    });
    expect(scope).not.to.be.ok;
  });

  it('delete single client scope by name', async () => {
    await this.kcAdminClient.clientScopes.delByName({
      name: this.currentClientScopeName,
    });
    const scope = await this.kcAdminClient.clientScopes.findOneByName({
      name: this.currentClientScopeName,
    });
    expect(scope).not.to.be.ok;
  });

  describe('default client scope', () => {
    it('list default client scopes', async () => {
      const defaultClientScopes = await this.kcAdminClient.clientScopes.listDefaultClientScopes();
      expect(defaultClientScopes).to.be.ok;
    });

    it('add default client scope', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addDefaultClientScope({id});

      const defaultClientScopeList = await this.kcAdminClient.clientScopes.listDefaultClientScopes();
      const defaultClientScope = defaultClientScopeList.find(
        scope => scope.id === id,
      );

      expect(defaultClientScope).to.be.ok;
      expect(defaultClientScope.id).to.equal(this.currentClientScope.id);
      expect(defaultClientScope.name).to.equal(this.currentClientScope.name);
    });

    it('delete default client scope', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addDefaultClientScope({id});

      await this.kcAdminClient.clientScopes.delDefaultClientScope({id});

      const defaultClientScopeList = await this.kcAdminClient.clientScopes.listDefaultClientScopes();
      const defaultClientScope = defaultClientScopeList.find(
        scope => scope.id === id,
      );

      expect(defaultClientScope).not.to.be.ok;
    });
  });

  describe('default optional client scopes', () => {
    it('list default optional client scopes', async () => {
      const defaultOptionalClientScopes = await this.kcAdminClient.clientScopes.listDefaultOptionalClientScopes();
      expect(defaultOptionalClientScopes).to.be.ok;
    });

    it('add default optional client scope', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addDefaultOptionalClientScope({id});

      const defaultOptionalClientScopeList = await this.kcAdminClient.clientScopes.listDefaultOptionalClientScopes();
      const defaultOptionalClientScope = defaultOptionalClientScopeList.find(
        scope => scope.id === id,
      );

      expect(defaultOptionalClientScope).to.be.ok;
      expect(defaultOptionalClientScope.id).to.eq(this.currentClientScope.id);
      expect(defaultOptionalClientScope.name).to.eq(
        this.currentClientScope.name,
      );
    });

    it('delete default optional client scope', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addDefaultOptionalClientScope({id});
      await this.kcAdminClient.clientScopes.delDefaultOptionalClientScope({id});

      const defaultOptionalClientScopeList = await this.kcAdminClient.clientScopes.listDefaultOptionalClientScopes();
      const defaultOptionalClientScope = defaultOptionalClientScopeList.find(
        scope => scope.id === id,
      );

      expect(defaultOptionalClientScope).not.to.be.ok;
    });
  });

  describe('protocol mappers', () => {
    let dummyMapper: ProtocolMapperRepresentation;

    beforeEach(() => {
      dummyMapper = {
        name: 'mapping-maps-mapper',
        protocol: 'openid-connect',
        protocolMapper: 'oidc-audience-mapper',
      };
    });

    afterEach(async () => {
      try {
        const {id} = this.currentClientScope;
        const {
          id: mapperId,
        } = await this.kcAdminClient.clientScopes.findProtocolMapperByName({
          id,
          name: dummyMapper.name,
        });
        await this.kcAdminClient.clientScopes.delProtocolMapper({
          id,
          mapperId,
        });
      } catch (e) {
        // ignore
      }
    });

    it('list protocol mappers', async () => {
      const {id} = this.currentClientScope;
      const mapperList = await this.kcAdminClient.clientScopes.listProtocolMappers(
        {id},
      );
      expect(mapperList).to.be.ok;
    });

    it('add multiple protocol mappers', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addMultipleProtocolMappers({id}, [
        dummyMapper,
      ]);

      const mapper = await this.kcAdminClient.clientScopes.findProtocolMapperByName(
        {id, name: dummyMapper.name},
      );
      expect(mapper).to.be.ok;
      expect(mapper.protocol).to.eq(dummyMapper.protocol);
      expect(mapper.protocolMapper).to.eq(dummyMapper.protocolMapper);
    });

    it('add single protocol mapper', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addProtocolMapper(
        {id},
        dummyMapper,
      );

      const mapper = await this.kcAdminClient.clientScopes.findProtocolMapperByName(
        {id, name: dummyMapper.name},
      );
      expect(mapper).to.be.ok;
      expect(mapper.protocol).to.eq(dummyMapper.protocol);
      expect(mapper.protocolMapper).to.eq(dummyMapper.protocolMapper);
    });

    it('find protocol mapper by id', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addProtocolMapper(
        {id},
        dummyMapper,
      );

      const {
        id: mapperId,
      } = await this.kcAdminClient.clientScopes.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      const mapper = await this.kcAdminClient.clientScopes.findProtocolMapperById(
        {id, mapperId},
      );

      expect(mapper).to.be.ok;
      expect(mapper.id).to.eql(mapperId);
    });

    it('find protocol mapper by name', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addProtocolMapper(
        {id},
        dummyMapper,
      );

      const mapper = await this.kcAdminClient.clientScopes.findProtocolMapperByName(
        {id, name: dummyMapper.name},
      );

      expect(mapper).to.be.ok;
      expect(mapper.name).to.eql(dummyMapper.name);
    });

    it('find protocol mappers by protocol', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addProtocolMapper(
        {id},
        dummyMapper,
      );

      const mapperList = await this.kcAdminClient.clientScopes.findProtocolMappersByProtocol(
        {id, protocol: dummyMapper.protocol},
      );

      expect(mapperList).to.be.ok;
      expect(mapperList.length).to.be.gte(1);

      const mapper = mapperList.find(item => item.name === dummyMapper.name);
      expect(mapper).to.be.ok;
    });

    it('update protocol mapper', async () => {
      const {id} = this.currentClientScope;

      dummyMapper.config = {'access.token.claim': 'true'};
      await this.kcAdminClient.clientScopes.addProtocolMapper(
        {id},
        dummyMapper,
      );
      const mapper = await this.kcAdminClient.clientScopes.findProtocolMapperByName(
        {id, name: dummyMapper.name},
      );

      expect(mapper.config['access.token.claim']).to.eq('true');

      mapper.config = {'access.token.claim': 'false'};

      await this.kcAdminClient.clientScopes.updateProtocolMapper(
        {id, mapperId: mapper.id},
        mapper,
      );

      const updatedMapper = await this.kcAdminClient.clientScopes.findProtocolMapperByName(
        {id, name: dummyMapper.name},
      );

      expect(updatedMapper.config['access.token.claim']).to.eq('false');
    });

    it('delete protocol mapper', async () => {
      const {id} = this.currentClientScope;
      await this.kcAdminClient.clientScopes.addProtocolMapper(
        {id},
        dummyMapper,
      );

      const {
        id: mapperId,
      } = await this.kcAdminClient.clientScopes.findProtocolMapperByName({
        id,
        name: dummyMapper.name,
      });

      await this.kcAdminClient.clientScopes.delProtocolMapper({id, mapperId});

      const mapper = await this.kcAdminClient.clientScopes.findProtocolMapperByName(
        {id, name: dummyMapper.name},
      );

      expect(mapper).not.to.be.ok;
    });
  });

  describe('scope mappings', () => {
    it('list client and realm scope mappings', async () => {
      const {id} = this.currentClientScope;
      const scopes = await this.kcAdminClient.clientScopes.listScopeMappings({
        id,
      });
      expect(scopes).to.be.ok;
    });

    describe('client', () => {
      const dummyClientId = 'scopeMappings-dummy';
      const dummyRoleName = 'scopeMappingsRole-dummy';

      beforeEach(async () => {
        const {id} = await this.kcAdminClient.clients.create({
          clientId: dummyClientId,
        });
        this.currentClient = await this.kcAdminClient.clients.findOne({
          id,
        });

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
        try {
          const {id} = this.currentClient;
          await this.kcAdminClient.clients.del({id});
        } catch (e) {
          // ignore
          console.log(e);
        }
      });

      it('add scope mappings', async () => {
        const {id} = this.currentClientScope;
        const {id: clientUniqueId} = this.currentClient;

        const availableRoles = await this.kcAdminClient.clientScopes.listAvailableClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
        );

        await this.kcAdminClient.clientScopes.addClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
          availableRoles,
        );

        const roles = await this.kcAdminClient.clientScopes.listClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
        );

        expect(roles).to.be.ok;
        expect(roles).to.be.eql(availableRoles);
      });

      it('list scope mappings', async () => {
        const {id} = this.currentClientScope;
        const {id: clientUniqueId} = this.currentClient;
        const roles = await this.kcAdminClient.clientScopes.listClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('list available scope mappings', async () => {
        const {id} = this.currentClientScope;
        const {id: clientUniqueId} = this.currentClient;
        const roles = await this.kcAdminClient.clientScopes.listAvailableClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('list composite scope mappings', async () => {
        const {id} = this.currentClientScope;
        const {id: clientUniqueId} = this.currentClient;
        const roles = await this.kcAdminClient.clientScopes.listCompositeClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
        );
        expect(roles).to.be.ok;
      });

      it('delete scope mappings', async () => {
        const {id} = this.currentClientScope;
        const {id: clientUniqueId} = this.currentClient;

        const rolesBefore = await this.kcAdminClient.clientScopes.listClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
        );

        await this.kcAdminClient.clientScopes.delClientScopeMappings(
          {
            id,
            client: clientUniqueId,
          },
          rolesBefore,
        );

        const rolesAfter = await this.kcAdminClient.clientScopes.listClientScopeMappings(
          {
            id,
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
        const {id} = this.currentClientScope;

        const availableRoles = await this.kcAdminClient.clientScopes.listAvailableRealmScopeMappings(
          {
            id,
          },
        );

        await this.kcAdminClient.clientScopes.addRealmScopeMappings(
          {
            id,
          },
          availableRoles,
        );

        const roles = await this.kcAdminClient.clientScopes.listRealmScopeMappings(
          {
            id,
          },
        );

        expect(roles).to.be.ok;
        expect(roles.sort((a, b) => (a.name < b.name ? -1 : 1))).to.be.eql(
          availableRoles.sort((a, b) => (a.name < b.name ? -1 : 1)),
        );
      });

      it('list scope mappings', async () => {
        const {id} = this.currentClientScope;
        const roles = await this.kcAdminClient.clientScopes.listRealmScopeMappings(
          {
            id,
          },
        );
        expect(roles).to.be.ok;
      });

      it('list available scope mappings', async () => {
        const {id} = this.currentClientScope;
        const roles = await this.kcAdminClient.clientScopes.listAvailableRealmScopeMappings(
          {
            id,
          },
        );
        expect(roles).to.be.ok;
      });

      it('list composite scope mappings', async () => {
        const {id} = this.currentClientScope;
        const roles = await this.kcAdminClient.clientScopes.listCompositeRealmScopeMappings(
          {
            id,
          },
        );
        expect(roles).to.be.ok;
      });

      it('delete scope mappings', async () => {
        const {id} = this.currentClientScope;

        const rolesBefore = await this.kcAdminClient.clientScopes.listRealmScopeMappings(
          {
            id,
          },
        );

        await this.kcAdminClient.clientScopes.delRealmScopeMappings(
          {
            id,
          },
          rolesBefore,
        );

        const rolesAfter = await this.kcAdminClient.clientScopes.listRealmScopeMappings(
          {
            id,
          },
        );

        expect(rolesAfter).to.be.ok;
        expect(rolesAfter).to.eql([]);
      });
    });
  });
});
