// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from '@faker-js/faker';
const expect = chai.expect;

describe('Realms', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentRealmId: string;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);

    const realmId = faker.internet.userName();
    const realm = await kcAdminClient.realms.create({
      id: realmId,
      realm: realmId,
    });
    expect(realm.realmName).to.be.ok;
    currentRealmId = realmId;
  });

  after(async () => {
    await kcAdminClient.realms.del({realm: currentRealmId});
  });

  it('add a user to another realm', async () => {
    const username = faker.internet.userName().toLowerCase();
    const user = await kcAdminClient.users.create({
      realm: currentRealmId,
      username,
      email: 'wwwy3y3@canner.io',
      // enabled required to be true in order to send actions email
      emailVerified: true,
      enabled: true,
    });
    const foundUser = (await kcAdminClient.users.findOne({
      realm: currentRealmId,
      id: user.id,
    }))!;
    expect(foundUser.username).to.be.eql(username);
  });
});
