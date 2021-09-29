// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';

import ComponentRepresentation from '../src/defs/componentRepresentation';

const expect = chai.expect;

describe('Users federation provider', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentUserFed: ComponentRepresentation;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);

    const name = faker.internet.userName();
    currentUserFed = await kcAdminClient.components.create({
      name,
      parentId: 'master',
      providerId: 'ldap',
      providerType: 'org.keycloak.storage.UserStorageProvider',
    });
  });

  after(async () => {
    await kcAdminClient.components.del({
      id: currentUserFed.id!,
    });
  });

  it('list storage provider', async () => {
    const name = await kcAdminClient.userStorageProvider.name({
      id: currentUserFed.id!,
    });
    expect(name).to.be.ok;
  });

  it('remove imported users', async () => {
    await kcAdminClient.userStorageProvider.removeImportedUsers({
      id: currentUserFed.id!,
    });
  });

  it('unlink users', async () => {
    await kcAdminClient.userStorageProvider.unlinkUsers({
      id: currentUserFed.id!,
    });
  });
});
