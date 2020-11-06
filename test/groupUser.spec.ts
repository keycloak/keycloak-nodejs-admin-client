// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {pick, omit} from 'lodash';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import UserRepresentation from '../src/defs/userRepresentation';
import GroupRepresentation from '../src/defs/groupRepresentation';

const expect = chai.expect;

describe('Group user integration', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentGroup: GroupRepresentation;
  let currentUser: UserRepresentation;

  before(async () => {
    const groupName = faker.internet.userName();
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
    // create group
    const group = await kcAdminClient.groups.create({
      name: groupName,
    });
    currentGroup = await kcAdminClient.groups.findOne({id: group.id});

    // create user
    const username = faker.internet.userName();
    const user = await kcAdminClient.users.create({
      username,
      email: 'wwwy3y3@canner.io',
      enabled: true,
    });
    currentUser = await kcAdminClient.users.findOne({id: user.id});
  });

  after(async () => {
    await kcAdminClient.groups.del({
      id: currentGroup.id,
    });
    await kcAdminClient.users.del({
      id: currentUser.id,
    });
  });

  it('should list user\'s group and expect empty', async () => {
    const groups = await kcAdminClient.users.listGroups({
      id: currentUser.id,
    });
    expect(groups).to.be.eql([]);
  });

  it('should add user to group', async () => {
    await kcAdminClient.users.addToGroup({
      id: currentUser.id,
      groupId: currentGroup.id,
    });

    const groups = await kcAdminClient.users.listGroups({
      id: currentUser.id,
    });
    // expect id,name,path to be the same
    expect(groups[0]).to.be.eql(pick(currentGroup, ['id', 'name', 'path']));
  });

  it('should list members using group api', async () => {
    const members = await kcAdminClient.groups.listMembers({
      id: currentGroup.id,
    });
    // access will not returned from member api
    expect(members[0]).to.be.eql(omit(currentUser, ['access']));
  });

  it('should remove user from group', async () => {
    await kcAdminClient.users.delFromGroup({
      id: currentUser.id,
      groupId: currentGroup.id,
    });

    const groups = await kcAdminClient.users.listGroups({
      id: currentUser.id,
    });
    expect(groups).to.be.eql([]);
  });
});
