import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';

const expect = chai.expect;

describe('Users', () => {
  it('list users', async () => {
    const client = new KeycloakAdminClient();
    await client.auth(cred);
    const users = await client.users.getUsers();
    // tslint:disable-next-line:no-unused-expression
    expect(users).to.be.ok;
  });
});
