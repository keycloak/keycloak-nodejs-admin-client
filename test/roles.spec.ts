// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { KeycloakAdminClient } from '../src/client';
import { cred } from './constants';
import RoleRepresentation from '../src/defs/roleRepresentation';

const expect = chai.expect;

declare module 'mocha' {
  // tslint:disable-next-line:interface-name
  interface ISuiteCallbackContext {
    client?: KeycloakAdminClient;
    currentRole?: RoleRepresentation;
  }
}

describe('Roles', function() {
  before(async () => {
    this.client = new KeycloakAdminClient();
    await this.client.auth(cred);
  });

  it('list roles', async () => {
    const roles = await this.client.roles.find();
    expect(roles).to.be.ok;
  });

  it('create roles and get by name', async () => {
    await this.client.roles.create({
      name: 'cool-role'
    });

    const role = await this.client.roles.findOneByName({name: 'cool-role'});
    expect(role).to.be.ok;
    this.currentRole = role;
  });

  it('get single roles by id', async () => {
    const roleId = this.currentRole.id;
    const role = await this.client.roles.findOneById({
      id: roleId
    });
    expect(role).to.deep.include(this.currentRole);
  });

  it('update single role by name & by id', async () => {
    await this.client.roles.updateByName({name: this.currentRole.name}, {
      // dont know why if role name not exist in payload, role name will be overriden with empty string
      // todo: open an issue on keycloak
      name: 'cool-role',
      description: 'cool'
    });

    const role = await this.client.roles.findOneByName({
      name: this.currentRole.name,
    });
    expect(role).to.include({
      description: 'cool'
    });

    await this.client.roles.updateById({id: this.currentRole.id}, {
      description: 'another description'
    });

    const roleById = await this.client.roles.findOneById({
      id: this.currentRole.id,
    });
    expect(roleById).to.include({
      description: 'another description'
    });
  });

  it('delete single roles by id', async () => {
    const roleId = this.currentRole.id;
    await this.client.roles.create({
      name: 'for-delete'
    });

    await this.client.roles.delByName({
      name: 'for-delete'
    });

    // delete the currentRole with id
    await this.client.roles.delById({
      id: roleId
    });

    // both should be null
    const role = await this.client.roles.findOneById({
      id: roleId
    });
    expect(role).to.be.null;

    const roleDelByName = await this.client.roles.findOneByName({
      name: 'for-delete'
    });
    expect(roleDelByName).to.be.null;
  });
});
