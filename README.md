## keycloak-admin

[![npm version](https://badge.fury.io/js/keycloak-admin.svg)](https://badge.fury.io/js/keycloak-admin) [![Travis (.org)](https://img.shields.io/travis/Canner/keycloak-admin.svg)](https://travis-ci.org/Canner/keycloak-admin)

Node.js Keycloak admin client

## Features

- TypeScript supported
- Keycloak latest version (v4.1) supported
- [Complete resource definitions](https://github.com/Canner/keycloak-admin/tree/master/src/defs)
- [Well-tested for supported APIs](https://github.com/Canner/keycloak-admin/tree/master/test)

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

// Authorize with username/password
await kcAdminClient.auth({
  username: 'wwwy3y3',
  password: 'wwwy3y3',
  grantType: 'password',
  clientId: 'admin-cli'
});

// List all users
const users = await kcAdminClient.users.find();

// Pass a `realm` value to override the realm for an operation
// For example: create a user in another realm:
await this.kcAdminClient.users.create({
  realm: 'another-realm',
  username: 'username',
  email: 'user@example.com'
});
```

## Supported APIs

### [Realm admin](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_realms_admin_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/realms.spec.ts

- Import a realm from a full representation of that realm (`POST /`)
- Get the top-level representation of the realm (`GET /{realm}`)
- Update the top-level information of the realm (`PUT /{realm}`)
- Delete the realm (`DELETE /{realm}`)

### [Role](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_roles_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/roles.spec.ts

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

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/users.spec.ts

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

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/users.spec.ts#L143

- Get user role-mappings (`GET /{realm}/users/{id}/role-mappings`)
- Add realm-level role mappings to the user (`POST /{realm}/users/{id}/role-mappings/realm`)
- Get realm-level role mappings (`GET /{realm}/users/{id}/role-mappings/realm`)
- Delete realm-level role mappings (`DELETE /{realm}/users/{id}/role-mappings/realm`)
- Get realm-level roles that can be mapped (`GET /{realm}/users/{id}/role-mappings/realm/available`)

### [Group](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_groups_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/groups.spec.ts

- Create (`POST /{realm}/groups`)
- List (`GET /{realm}/groups`)
- Get one (`GET /{realm}/groups/{id}`)
- Update (`PUT /{realm}/groups/{id}`)
- Delete (`DELETE /{realm}/groups/{id}`)
- List members (`GET /{realm}/groups/{id}/members`)

### Group role-mapping

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/groups.spec.ts#L76

- Get group role-mappings (`GET /{realm}/groups/{id}/role-mappings`)
- Add realm-level role mappings to the group (`POST /{realm}/groups/{id}/role-mappings/realm`)
- Get realm-level role mappings (`GET /{realm}/groups/{id}/role-mappings/realm`)
- Delete realm-level role mappings (`DELETE /{realm}/groups/{id}/role-mappings/realm`)
- Get realm-level roles that can be mapped (`GET /{realm}/groups/{id}/role-mappings/realm/available`)

### [Client](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_clients_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/clients.spec.ts

- Create a new client (`POST /{realm}/clients`)
- Get clients belonging to the realm (`GET /{realm}/clients`)
- Get representation of the client (`GET /{realm}/clients/{id}`)
- Update the client (`PUT /{realm}/clients/{id}`)
- Delete the client (`DELETE /{realm}/clients/{id}`)

### [Client roles](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_roles_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/clients.spec.ts

- Create a new role for the client (`POST /{realm}/clients/{id}/roles`)
- Get all roles for the client (`GET /{realm}/clients/{id}/roles`)
- Get a role by name (`GET /{realm}/clients/{id}/roles/{role-name}`)
- Update a role by name (`PUT /{realm}/clients/{id}/roles/{role-name}`)
- Delete a role by name (`DELETE /{realm}/clients/{id}/roles/{role-name}`)

### [Client role-mapping for group](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_role_mappings_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/groups.spec.ts#L150

- Add client-level roles to the group role mapping (`POST /{realm}/groups/{id}/role-mappings/clients/{client}`)
- Get client-level role mappings for the group (`GET /{realm}/groups/{id}/role-mappings/clients/{client}`)
- Delete client-level roles from group role mapping (`DELETE /{realm}/groups/{id}/role-mappings/clients/{client}`)
- Get available client-level roles that can be mapped to the group (`GET /{realm}/groups/{id}/role-mappings/clients/{client}/available`)

### [Client role-mapping for user](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_client_role_mappings_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/users.spec.ts#L217

- Add client-level roles to the user role mapping (`POST /{realm}/users/{id}/role-mappings/clients/{client}`)
- Get client-level role mappings for the user (`GET /{realm}/users/{id}/role-mappings/clients/{client}`)
- Delete client-level roles from user role mapping (`DELETE /{realm}/users/{id}/role-mappings/clients/{client}`)
- Get available client-level roles that can be mapped to the user (`GET /{realm}/users/{id}/role-mappings/clients/{client}/available`)

### [Identity Providers](https://www.keycloak.org/docs-api/4.1/rest-api/index.html#_identity_providers_resource)

Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/idp.spec.ts

- Create a new identity provider (`POST /{realm}/identity-provider/instances`)
- Get identity providers (`GET /{realm}/identity-provider/instances`)
- Get the identity provider (`GET /{realm}/identity-provider/instances/{alias}`)
- Update the identity provider (`PUT /{realm}/identity-provider/instances/{alias}`)
- Delete the identity provider (`DELETE /{realm}/identity-provider/instances/{alias}`)

### [Component]()

Supported for [user federation](https://www.keycloak.org/docs/latest/server_admin/index.html#_user-storage-federation). Demo code: https://github.com/Canner/keycloak-admin/blob/master/test/components.spec.ts

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
