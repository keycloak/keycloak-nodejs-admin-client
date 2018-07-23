// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
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
    await this.kcAdminClient.auth(cred);

    // create idp
    const alias = faker.internet.userName();
    await this.kcAdminClient.identityProviders.create({
      alias,
      providerId: 'saml'
    });
    this.currentIdpAlias = alias;
  });

  after(async () => {
    await this.kcAdminClient.identityProviders.del({
      alias: this.currentIdpAlias
    });

    // check deleted
    const idp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias
    });
    expect(idp).to.be.null;
  });

  it('list idp', async () => {
    const idps = await this.kcAdminClient.identityProviders.find();
    expect(idps.length).to.be.least(1);
  });

  it('get an idp', async () => {
    const idp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias
    });
    expect(idp).to.include({
      alias: this.currentIdpAlias
    });
  });

  it('update an idp', async () => {
    const idp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias
    });
    await this.kcAdminClient.identityProviders.update({alias: this.currentIdpAlias}, {
      // alias and internalId are requried to update
      alias: idp.alias,
      internalId: idp.internalId,
      displayName: 'test'
    });
    const updatedIdp = await this.kcAdminClient.identityProviders.findOne({
      alias: this.currentIdpAlias
    });

    expect(updatedIdp).to.include({
      alias: this.currentIdpAlias,
      displayName: 'test'
    });
  });
});
