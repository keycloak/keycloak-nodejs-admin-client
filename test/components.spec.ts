// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import ComponentRepresentation from '../src/defs/componentRepresentation';
const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentUserFed?: ComponentRepresentation;
  }
}

describe('User federation using component api', function() {
  before(async () => {
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(credentials);

    // create user fed
    const name = faker.internet.userName();
    const component = await this.kcAdminClient.components.create({
      name,
      parentId: 'master',
      providerId: 'ldap',
      providerType: 'org.keycloak.storage.UserStorageProvider',
    });
    expect(component.id).to.be.ok;

    // assign current user fed
    const fed = await this.kcAdminClient.components.findOne({
      id: component.id,
    });
    this.currentUserFed = fed;
  });

  after(async () => {
    await this.kcAdminClient.components.del({
      id: this.currentUserFed.id,
    });

    // check deleted
    const idp = await this.kcAdminClient.components.findOne({
      id: this.currentUserFed.id,
    });
    expect(idp).to.be.null;
  });

  it('list user federations', async () => {
    const feds = await this.kcAdminClient.components.find({
      parent: 'master',
      type: 'org.keycloak.storage.UserStorageProvider',
    });
    expect(feds.length).to.be.least(1);
  });

  it('get a user federation', async () => {
    const fed = await this.kcAdminClient.components.findOne({
      id: this.currentUserFed.id,
    });
    expect(fed).to.include({
      id: this.currentUserFed.id,
    });
  });

  it('update a user federation', async () => {
    await this.kcAdminClient.components.update(
      {id: this.currentUserFed.id},
      {
        // parentId, providerId, providerType required for update
        parentId: 'master',
        providerId: 'ldap',
        providerType: 'org.keycloak.storage.UserStorageProvider',
        name: 'cool-name',
      },
    );
    const updated = await this.kcAdminClient.components.findOne({
      id: this.currentUserFed.id,
    });

    expect(updated).to.include({
      id: this.currentUserFed.id,
      name: 'cool-name',
    });
  });
});
