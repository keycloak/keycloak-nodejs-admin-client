// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import UserRepresentation from '../src/defs/userRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    client?: KeycloakAdminClient;
    currentGroup?: GroupRepresentation;
  }
}

describe('Groups', function() {
  before(async () => {
    this.client = new KeycloakAdminClient();
    await this.client.auth(cred);
  });

  it('list groups', async () => {
    const groups = await this.client.groups.find();
    expect(groups).to.be.ok;
  });

  it('create groups', async () => {
    await this.client.groups.create({
      name: 'cool-group'
    });

    const groups = await this.client.groups.find({search: 'cool-group'});
    expect(groups[0]).to.be.ok;
    this.currentGroup = groups[0];
  });

  it('get single groups', async () => {
    const groupId = this.currentGroup.id;
    const group = await this.client.groups.findOne({
      id: groupId
    });
    // get group from id will contains more fields than listing api
    expect(group).to.deep.include(this.currentGroup);
  });

  it('update single groups', async () => {
    const groupId = this.currentGroup.id;
    await this.client.groups.update({
      id: groupId,
      name: 'another-group-name'
    });

    const group = await this.client.groups.findOne({
      id: groupId
    });
    expect(group).to.include({
      name: 'another-group-name'
    });
  });

  it('delete single groups', async () => {
    const groupId = this.currentGroup.id;
    await this.client.groups.del({
      id: groupId
    });

    const group = await this.client.groups.findOne({
      id: groupId
    });
    expect(group).to.be.null;
  });
});
