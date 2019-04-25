## keycloak-admin

[![npm version](https://badge.fury.io/js/keycloak-admin.svg)](https://badge.fury.io/js/keycloak-admin) [![Travis (.org)](https://img.shields.io/travis/keycloak/keycloak-nodejs-admin-client.svg)](https://travis-ci.org/keycloak/keycloak-nodejs-admin-client)

Node.js Keycloak admin client

## Features

- TypeScript supported
- Keycloak latest version (v4.1) supported
- [Complete resource definitions](https://github.com/keycloak/keycloak-nodejs-admin-client/tree/master/src/defs)
- [Well-tested for supported APIs](https://github.com/keycloak/keycloak-nodejs-admin-client/tree/master/test)

## Install

```sh
yarn add keycloak-admin
```

## Usage

```js
import KcAdminClient from 'keycloak-admin';

// To configure the client, pass an object to override any of these  options:
// {
//   baseUrl: 'http://127.0.0.1:8080/auth',
//   realmName: 'master',
//   requestConfig: {
//     /* Axios request config options https://github.com/axios/axios#request-config */
//   },
// }
const kcAdminClient = new KcAdminClient();

// Authorize with username / password
await kcAdminClient.auth({
  username: 'wwwy3y3',
  password: 'wwwy3y3',
  grantType: 'password',
  clientId: 'admin-cli',
});

// List all users
const users = await kcAdminClient.users.find();

// Override client configuration for all further requests:
kcAdminClient.setConfig({
  realmName: 'another-realm',
});

// This operation will now be performed in 'another-realm' if the user has access.
const groups = await kcAdminClient.groups.find();

// Set a `realm` property to override the realm for only a single operation.
// For example, creating a user in another realm:
await this.kcAdminClient.users.create({
  realm: 'a-third-realm',
  username: 'username',
  email: 'user@example.com',
});
```

To refresh the access token provided by Keycloak, an OpenID client like [panva/node-openid-client](https://github.com/panva/node-openid-client) can be used like this:

```js
import {Issuer} from 'openid-client';

const keycloakIssuer = await Issuer.discover(
  'http://localhost:8080/auth/realms/master',
);

const client = new keycloakIssuer.Client({
  client_id: 'admin-cli', // Same as `clientId` passed to client.auth()
});

// Use the grant type 'password'
let tokenSet = await client.grant({
  grant_type: 'password',
  username: 'wwwy3y3',
  password: 'wwwy3y3',
});

// Periodically using refresh_token grant flow to get new access token here
setInterval(async () => {
  const refreshToken = tokenSet.refresh_token;
  tokenSet = await client.refresh(refreshToken);
  kcAdminClient.setAccessToken(tokenSet.access_token);
}, 58 * 1000); // 58 seconds
```

## Supported APIs

### [Realm admin](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_realms_admin_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/realms.spec.ts

- Import a realm from a full representation of that realm (`POST /`)
- Get the top-level representation of the realm (`GET /{realm}`)
- Update the top-level information of the realm (`PUT /{realm}`)
- Delete the realm (`DELETE /{realm}`)

### [Role](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_roles_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/roles.spec.ts

- Create a new role for the realm (`POST /{realm}/roles`)
- Get all roles for the realm (`GET /{realm}/roles`)
- Get a role by name (`GET /{realm}/roles/{role-name}`)
- Update a role by name (`PUT /{realm}/roles/{role-name}`)
- Delete a role by name (`DELETE /{realm}/roles/{role-name}`)

### [Roles (by ID)](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_roles_by_id_resource)

- Get a specific role (`GET /{realm}/roles-by-id/{role-id}`)
- Update the role (`PUT /{realm}/roles-by-id/{role-id}`)
- Delete the role (`DELETE /{realm}/roles-by-id/{role-id}`)

### [User](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_users_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/users.spec.ts

- Create a new user (`POST /{realm}/users`)
- Get users Returns a list of users, filtered according to query parameters (`GET /{realm}/users`)
- Get representation of the user (`GET /{realm}/users/{id}`)
- Update the user (`PUT /{realm}/users/{id}`)
- Delete the user (`DELETE /{realm}/users/{id}`)
- Send a update account email to the user An email contains a link the user can click to perform a set of required actions. (`PUT /{realm}/users/{id}/execute-actions-email`)
- Get user groups (`GET /{realm}/users/{id}/groups`)
- Add user to group (`PUT /{realm}/users/{id}/groups/{groupId}`)
- Delete user from group (`DELETE /{realm}/users/{id}/groups/{groupId}`)
- Remove TOTP from the user (`PUT /{realm}/users/{id}/remove-totp`)
- Set up a temporary password for the user User will have to reset the temporary password next time they log in. (`PUT /{realm}/users/{id}/reset-password`)
- Send an email-verification email to the user An email contains a link the user can click to verify their email address. (`PUT /{realm}/users/{id}/send-verify-email`)

### User role-mapping

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/users.spec.ts#L143

- Get user role-mappings (`GET /{realm}/users/{id}/role-mappings`)
- Add realm-level role mappings to the user (`POST /{realm}/users/{id}/role-mappings/realm`)
- Get realm-level role mappings (`GET /{realm}/users/{id}/role-mappings/realm`)
- Delete realm-level role mappings (`DELETE /{realm}/users/{id}/role-mappings/realm`)
- Get realm-level roles that can be mapped (`GET /{realm}/users/{id}/role-mappings/realm/available`)
- Get effective realm-level role mappings This will recurse all composite roles to get the result. (`GET /{realm}/users/{id}/role-mappings/realm/composite`)

### [Group](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_groups_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/groups.spec.ts

- Create (`POST /{realm}/groups`)
- List (`GET /{realm}/groups`)
- Get one (`GET /{realm}/groups/{id}`)
- Update (`PUT /{realm}/groups/{id}`)
- Delete (`DELETE /{realm}/groups/{id}`)
- List members (`GET /{realm}/groups/{id}/members`)
- Set or create child (`POST /{realm}/groups/{id}/children`)

### Group role-mapping

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/groups.spec.ts#L76

- Get group role-mappings (`GET /{realm}/groups/{id}/role-mappings`)
- Add realm-level role mappings to the group (`POST /{realm}/groups/{id}/role-mappings/realm`)
- Get realm-level role mappings (`GET /{realm}/groups/{id}/role-mappings/realm`)
- Delete realm-level role mappings (`DELETE /{realm}/groups/{id}/role-mappings/realm`)
- Get realm-level roles that can be mapped (`GET /{realm}/groups/{id}/role-mappings/realm/available`)

### [Client](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_clients_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/clients.spec.ts

- Create a new client (`POST /{realm}/clients`)
- Get clients belonging to the realm (`GET /{realm}/clients`)
- Get representation of the client (`GET /{realm}/clients/{id}`)
- Update the client (`PUT /{realm}/clients/{id}`)
- Delete the client (`DELETE /{realm}/clients/{id}`)

### [Client roles](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_roles_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/clients.spec.ts

- Create a new role for the client (`POST /{realm}/clients/{id}/roles`)
- Get all roles for the client (`GET /{realm}/clients/{id}/roles`)
- Get a role by name (`GET /{realm}/clients/{id}/roles/{role-name}`)
- Update a role by name (`PUT /{realm}/clients/{id}/roles/{role-name}`)
- Delete a role by name (`DELETE /{realm}/clients/{id}/roles/{role-name}`)

### [Client role-mapping for group](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_role_mappings_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/groups.spec.ts#L150

- Add client-level roles to the group role mapping (`POST /{realm}/groups/{id}/role-mappings/clients/{client}`)
- Get client-level role mappings for the group (`GET /{realm}/groups/{id}/role-mappings/clients/{client}`)
- Delete client-level roles from group role mapping (`DELETE /{realm}/groups/{id}/role-mappings/clients/{client}`)
- Get available client-level roles that can be mapped to the group (`GET /{realm}/groups/{id}/role-mappings/clients/{client}/available`)

### [Client role-mapping for user](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_role_mappings_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/users.spec.ts#L217

- Add client-level roles to the user role mapping (`POST /{realm}/users/{id}/role-mappings/clients/{client}`)
- Get client-level role mappings for the user (`GET /{realm}/users/{id}/role-mappings/clients/{client}`)
- Delete client-level roles from user role mapping (`DELETE /{realm}/users/{id}/role-mappings/clients/{client}`)
- Get available client-level roles that can be mapped to the user (`GET /{realm}/users/{id}/role-mappings/clients/{client}/available`)

### [Identity Providers](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_identity_providers_resource)

Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/idp.spec.ts

- Create a new identity provider (`POST /{realm}/identity-provider/instances`)
- Get identity providers (`GET /{realm}/identity-provider/instances`)
- Get the identity provider (`GET /{realm}/identity-provider/instances/{alias}`)
- Update the identity provider (`PUT /{realm}/identity-provider/instances/{alias}`)
- Delete the identity provider (`DELETE /{realm}/identity-provider/instances/{alias}`)
- Find identity provider factory (`GET /{realm}/identity-provider/providers/{providerId}`)
- Create a new identity provider mapper (`POST /{realm}/identity-provider/instances/{alias}/mappers`)
- Get identity provider mappers (`GET /{realm}/identity-provider/instances/{alias}/mappers`)
- Get the identity provider mapper (`GET /{realm}/identity-provider/instances/{alias}/mappers/{id}`)
- Update the identity provider mapper (`PUT /{realm}/identity-provider/instances/{alias}/mappers/{id}`)
- Delete the identity provider mapper (`DELETE /{realm}/identity-provider/instances/{alias}/mappers/{id}`)
- Find the identity provider mapper types (`GET /{realm}/identity-provider/instances/{alias}/mapper-types`)

### [Component]()

Supported for [user federation](https://www.keycloak.org/docs/latest/server_admin/index.html#_user-storage-federation). Demo code: https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/test/components.spec.ts

- Create (`POST /{realm}/components`)
- List (`GET /{realm}/components`)
- Get (`GET /{realm}/components/{id}`)
- Update (`PUT /{realm}/components/{id}`)
- Delete (`DELETE /{realm}/components/{id}`)

## Not yet supported

- [Attack Detection](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_attack_detection_resource)
- [Authentication Management](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_authentication_management_resource)
- [Client Attribute Certificate](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_attribute_certificate_resource)
- [Client Initial Access](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_initial_access_resource)
- [Client Registration Policy](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_registration_policy_resource)
- [Client Scopes](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_scopes_resource)
- [Key](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_key_resource)
- [Protocol Mappers](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_protocol_mappers_resource)
- [Scope Mappings](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_scope_mappings_resource)
- [User Storage Provider](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_user_storage_provider_resource)

## Maintainers

Checkout [MAINTAINERS.md](https://github.com/keycloak/keycloak-nodejs-admin-client/blob/master/MAINTAINERS.md) for detailed maintainers list.

This repo is originally developed by [Canner](https://www.cannercms.com) and [InfuseAI](https://infuseai.io) before being transferred under keycloak organization.
