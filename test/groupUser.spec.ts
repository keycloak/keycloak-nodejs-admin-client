// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {pick, omit} from 'lodash';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
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
    await this.kcAdminClient.auth(credentials);
    // create group
    const group = await this.kcAdminClient.groups.create({
      name: groupName,
    });
    this.currentGroup = await this.kcAdminClient.groups.findOne({id: group.id});

    // create user
    const username = faker.internet.userName();
    const user = await this.kcAdminClient.users.create({
      username,
      email: 'wwwy3y3@canner.io',
      enabled: true,
    });
    this.currentUser = await this.kcAdminClient.users.findOne({id: user.id});
  });

  after(async () => {
    await this.kcAdminClient.groups.del({
      id: this.currentGroup.id,
    });
    await this.kcAdminClient.users.del({
      id: this.currentUser.id,
    });
  });

  it('should list user\'s group and expect empty', async () => {
    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id,
    });
    expect(groups).to.be.eql([]);
  });

  it('should add user to group', async () => {
    await this.kcAdminClient.users.addToGroup({
      id: this.currentUser.id,
      groupId: this.currentGroup.id,
    });

    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id,
    });
    // expect id,name,path to be the same
    expect(groups[0]).to.be.eql(
      pick(this.currentGroup, ['id', 'name', 'path']),
    );
  });

  it('should list members using group api', async () => {
    const members = await this.kcAdminClient.groups.listMembers({
      id: this.currentGroup.id,
    });
    // access will not returned from member api
    expect(members[0]).to.be.eql(omit(this.currentUser, ['access']));
  });

  it('should remove user from group', async () => {
    await this.kcAdminClient.users.delFromGroup({
      id: this.currentUser.id,
      groupId: this.currentGroup.id,
    });

    const groups = await this.kcAdminClient.users.listGroups({
      id: this.currentUser.id,
    });
    expect(groups).to.be.eql([]);
  });
});
