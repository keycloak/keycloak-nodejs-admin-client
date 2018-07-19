// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import UserRepresentation from '../src/defs/userRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    client?: KeycloakAdminClient;
    currentUser?: UserRepresentation;
  }
}

describe('Users', function() {
  before(async () => {
    this.client = new KeycloakAdminClient();
    await this.client.auth(cred);
  });

  it('list users', async () => {
    const users = await this.client.users.find();
    expect(users).to.be.ok;
  });

  it('create users', async () => {
    await this.client.users.create({
      username: 'wwwy3y32'
    });

    const users = await this.client.users.find({username: 'wwwy3y32'});
    expect(users[0]).to.be.ok;
    this.currentUser = users[0];
  });

  it('get single users', async () => {
    const userId = this.currentUser.id;
    const user = await this.client.users.findOne({
      id: userId
    });
    expect(user).to.be.eql(this.currentUser);
  });

  it('update single users', async () => {
    const userId = this.currentUser.id;
    await this.client.users.update({
      id: userId,
      firstName: 'william',
      lastName: 'chang'
    });

    const user = await this.client.users.findOne({
      id: userId
    });
    expect(user).to.include({
      firstName: 'william',
      lastName: 'chang'
    });
  });

  it('delete single users', async () => {
    const userId = this.currentUser.id;
    await this.client.users.del({
      id: userId
    });

    const user = await this.client.users.findOne({
      id: userId
    });
    expect(user).to.be.null;
  });
});
