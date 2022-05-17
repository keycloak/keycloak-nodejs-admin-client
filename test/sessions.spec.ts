// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';

const expect = chai.expect;

describe('Sessions', () => {
  let client: KeycloakAdminClient;

  before(async () => {
    client = new KeycloakAdminClient();
    await client.auth(credentials);
  });

  it('gets client session stats', async () => {
    const sessions = await client.sessions.getClientSessionStats();
    expect(sessions).to.be.ok;
    expect(sessions.length).to.be.eq(1);
    expect(sessions[0].clientId).to.be.eq('admin-cli');
  });

  it('deletes a session', async () => {
    const user = (await client.users.find({username: credentials.username}))[0];
    const userSession = (await client.clients.listSessions({id: user.id!}))[0];

    await client.sessions.delete({session: userSession.id!});

    expect(await client.clients.listSessions({id: user.id!})).to.be.empty;
  });
});
