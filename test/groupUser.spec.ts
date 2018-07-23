// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { pick, omit } from 'lodash';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import faker from 'faker';
import UserRepresentation from '../src/defs/userRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    kcAdminClient?: KeycloakAdminClient;
    currentGroup?: GroupRepresentation;
    currentUser?: UserRepresentation;
  }
}

describe('Group user integration', function() {
  before(async () => {
    const groupName = faker.internet.userName();
    this.kcAdminClient = new KeycloakAdminClient();
    await this.kcAdminClient.auth(cred);
    // create group
    await this.kcAdminClient.groups.create({
      name: groupName
    });
    const groups = await this.kcAdminClient.groups.find({search: groupName});
    this.currentGroup = groups[0];

    // create user
    const username = faker.internet.userName();
    await this.kcAdminClient.users.create({
      username,
      email: 'wwwy3y3@canner.io',
      enabled: true
    });
    const users = await this.kcAdminClient.users.find({username});
    expect(users[0]).to.be.ok;
    this.currentUser = users[0];
  });

  after(async () => {
    await this.kcAdminClient.groups.del({
      id: this.currentGroup.id
    });
    await this.kcAdminClient.users.del({
      id: this.currentUser.id
    });
  });

  it('should list user\'s group and expect empty', async () => {
    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id
    });
    expect(groups).to.be.eql([]);
  });

  it('should add user to group', async () => {
    await this.kcAdminClient.users.addToGroup({
      id: this.currentUser.id,
      groupId: this.currentGroup.id
    });

    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id
    });
    // expect id,name,path to be the same
    expect(groups[0]).to.be.eql(pick(this.currentGroup, ['id', 'name', 'path']));
  });

  it('should list members using group api', async () => {
    const members = await this.kcAdminClient.groups.listMembers({
      id: this.currentGroup.id
    });
    // access will not returned from member api
    expect(members[0]).to.be.eql(omit(this.currentUser, ['access']));
  });

  it('should remove user from group', async () => {
    await this.kcAdminClient.users.delFromGroup({
      id: this.currentUser.id,
      groupId: this.currentGroup.id
    });

    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id
    });
    expect(groups).to.be.eql([]);
  });
});
