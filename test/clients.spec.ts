// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import faker from 'faker';
import ClientRepresentation from '../src/defs/ClientRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    client?: KeycloakAdminClient;
    currentClient?: ClientRepresentation;
  }
}

describe('Clients', function() {
  before(async () => {
    this.client = new KeycloakAdminClient();
    await this.client.auth(cred);
  });

  it('list clients', async () => {
    const clients = await this.client.clients.find();
    expect(clients).to.be.ok;
  });

  it('create clients', async () => {
    const clientId = faker.internet.userName();
    await this.client.clients.create({
      clientId
    });

    const clients = await this.client.clients.find({clientId});
    expect(clients[0]).to.be.ok;
    this.currentClient = clients[0];
  });

  it('get single client', async () => {
    const clientId = this.currentClient.id;
    const client = await this.client.clients.findOne({
      id: clientId
    });
    // not sure why entity from list api will not have property: authorizationServicesEnabled
    expect(client).to.deep.include(this.currentClient);
  });

  it('update single client', async () => {
    const clientId = this.currentClient.id;
    await this.client.clients.update({id: clientId}, {
      // clientId is required in client update. no idea why...
      clientId,
      description: 'test'
    });

    const client = await this.client.clients.findOne({
      id: clientId
    });
    expect(client).to.include({
      description: 'test'
    });
  });

  it('delete single client', async () => {
    const clientId = this.currentClient.id;
    await this.client.clients.del({
      id: clientId
    });

    const client = await this.client.clients.findOne({
      id: clientId
    });
    expect(client).to.be.null;
  });
});
