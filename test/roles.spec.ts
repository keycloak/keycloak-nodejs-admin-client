// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import RoleRepresentation from '../src/defs/roleRepresentation';

const expect = chai.expect;

describe('Roles', () => {
  let client: KeycloakAdminClient;
  let currentRole: RoleRepresentation;

  before(async () => {
    client = new KeycloakAdminClient();
    await client.auth(credentials);
  });

  it('list roles', async () => {
    const roles = await client.roles.find();
    expect(roles).to.be.ok;
  });

  it('create roles and get by name', async () => {
    const roleName = 'cool-role';
    const createdRole = await client.roles.create({
      name: roleName,
    });

    expect(createdRole.roleName).to.be.equal(roleName);
    const role = await client.roles.findOneByName({name: roleName});
    expect(role).to.be.ok;
    currentRole = role;
  });

  it('get single roles by id', async () => {
    const roleId = currentRole.id;
    const role = await client.roles.findOneById({
      id: roleId,
    });
    expect(role).to.deep.include(currentRole);
  });

  it('update single role by name & by id', async () => {
    await client.roles.updateByName(
      {name: currentRole.name},
      {
        // dont know why if role name not exist in payload, role name will be overriden with empty string
        // todo: open an issue on keycloak
        name: 'cool-role',
        description: 'cool',
      },
    );

    const role = await client.roles.findOneByName({
      name: currentRole.name,
    });
    expect(role).to.include({
      description: 'cool',
    });

    await client.roles.updateById(
      {id: currentRole.id},
      {
        description: 'another description',
      },
    );

    const roleById = await client.roles.findOneById({
      id: currentRole.id,
    });
    expect(roleById).to.include({
      description: 'another description',
    });
  });

  it('delete single roles by id', async () => {
    const roleId = currentRole.id;
    await client.roles.create({
      name: 'for-delete',
    });

    await client.roles.delByName({
      name: 'for-delete',
    });

    // delete the currentRole with id
    await client.roles.delById({
      id: roleId,
    });

    // both should be null
    const role = await client.roles.findOneById({
      id: roleId,
    });
    expect(role).to.be.null;

    const roleDelByName = await client.roles.findOneByName({
      name: 'for-delete',
    });
    expect(roleDelByName).to.be.null;
  });

  it('get users with role by name in realm', async () => {
    const users = await client.roles.findUsersWithRole({
      name: 'admin',
    });
    expect(users).to.be.ok;
    expect(users).to.be.an('array');
  });
});
