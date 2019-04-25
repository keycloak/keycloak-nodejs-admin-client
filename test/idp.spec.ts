// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentIdpAlias?: string;
  }
}

describe('Identity providers', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);

    // create idp
    const alias = faker.internet.userName();
    const idp = await this.kcAdminClient.identityProviders.create({
      alias,
      providerId: 'saml',
    });
    expect(idp.id).to.be.ok;
    this.currentIdpAlias = alias;

    // create idp mapper
    const mapper = {
      name: 'First Name',
      identityProviderAlias: this.currentIdpAlias,
      identityProviderMapper: 'saml-user-attribute-idp-mapper',
      config: {},
    };
    const idpMapper = await this.kcAdminClient.identityProviders.createMapper({
      alias: this.currentIdpAlias,
      identityProviderMapper: mapper,
    });
    expect(idpMapper.id).to.be.ok;
  });

  after(async () => {
    const idpMapper = await this.kcAdminClient.identityProviders.findMappers({
      alias: this.currentIdpAlias,
    });

    const idpMapperId = idpMapper[0].id;
    await this.kcAdminClient.identityProviders.delMapper({
      alias: this.currentIdpAlias,
      id: idpMapperId,
    });

    const idpMapperUpdated = await this.kcAdminClient.identityProviders.findOneMapper(
      {
        alias: this.currentIdpAlias,
        id: idpMapperId,
      },
    );

    // check idp mapper deleted
    expect(idpMapperUpdated).to.be.null;

    await this.kcAdminClient.identityProviders.del({
      alias: this.currentIdpAlias,
    });

    const idp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias,
    });

    // check idp deleted
    expect(idp).to.be.null;
  });

  it('list idp', async () => {
    const idps = await this.kcAdminClient.identityProviders.find();
    expect(idps.length).to.be.least(1);
  });

  it('get an idp', async () => {
    const idp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias,
    });
    expect(idp).to.include({
      alias: this.currentIdpAlias,
    });
  });

  it('update an idp', async () => {
    const idp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias,
    });
    await this.kcAdminClient.identityProviders.update(
      {alias: this.currentIdpAlias},
      {
        // alias and internalId are requried to update
        alias: idp.alias,
        internalId: idp.internalId,
        displayName: 'test',
      },
    );
    const updatedIdp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias,
    });

    expect(updatedIdp).to.include({
      alias: this.currentIdpAlias,
      displayName: 'test',
    });
  });

  it('list idp factory', async () => {
    const idpFactory = await this.kcAdminClient.identityProviders.findFactory({
      providerId: 'saml',
    });

    expect(idpFactory).to.include({
      id: 'saml',
    });
  });

  it('get an idp mapper', async () => {
    const mappers = await this.kcAdminClient.identityProviders.findMappers({
      alias: this.currentIdpAlias,
    });
    expect(mappers.length).to.be.least(1);
  });

  it('update an idp mapper', async () => {
    const idpMapper = await this.kcAdminClient.identityProviders.findMappers({
      alias: this.currentIdpAlias,
    });
    const idpMapperId = idpMapper[0].id;

    await this.kcAdminClient.identityProviders.updateMapper(
      {alias: this.currentIdpAlias, id: idpMapperId},
      {
        id: idpMapperId,
        identityProviderAlias: this.currentIdpAlias,
        identityProviderMapper: 'saml-user-attribute-idp-mapper',
        config: {
          'user.attribute': 'firstName',
        },
      },
    );

    const updatedIdpMappers = await this.kcAdminClient.identityProviders.findOneMapper(
      {
        alias: this.currentIdpAlias,
        id: idpMapperId,
      },
    );

    const userAttribute = updatedIdpMappers.config['user.attribute'];
    expect(userAttribute).to.equal('firstName');
  });
});
