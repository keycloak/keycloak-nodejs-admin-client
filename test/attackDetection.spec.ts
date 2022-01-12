// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from '@faker-js/faker';
import UserRepresentation from '../src/defs/userRepresentation';
const expect = chai.expect;

describe('Attack Detection', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentUser: UserRepresentation;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);

    const username = faker.internet.userName();
    currentUser = await kcAdminClient.users.create({
      username,
    });
  });

  after(async () => {
    await kcAdminClient.users.del({id: currentUser.id!});
  });

  it('list attack detection for user', async () => {
    const attackDetection = await kcAdminClient.attackDetection.findOne({id: currentUser.id!});
    expect(attackDetection).to.deep.equal({
      numFailures: 0,
      disabled: false,
      lastIPFailure: 'n/a',
      lastFailure: 0,
    });
  });

  it('clear any user login failures for all users', async () => {
    await kcAdminClient.attackDetection.delAll();
  });

  it('clear any user login failures for a user', async () => {
    await kcAdminClient.attackDetection.del({id: currentUser.id!});
  });
});
