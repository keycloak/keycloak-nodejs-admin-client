// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import {RequiredActionAlias} from '../src/defs/requiredActionProviderRepresentation';
const expect = chai.expect;

describe('Authentication management', () => {
  let kcAdminClient: KeycloakAdminClient;
  let currentRealm: string;
  let requiredActionProvider: Record<string, any>;

  before(async () => {
    kcAdminClient = new KeycloakAdminClient();
    await kcAdminClient.auth(credentials);
    const realmName = faker.internet.userName().toLowerCase();
    await kcAdminClient.realms.create({
      id: realmName,
      realm: realmName,
      enabled: true,
    });
    currentRealm = realmName;
    kcAdminClient.setConfig({
      realmName,
    });
  });

  after(async () => {
    // delete test realm
    await kcAdminClient.realms.del({realm: currentRealm});
    const realm = await kcAdminClient.realms.findOne({
      realm: currentRealm,
    });
    expect(realm).to.be.null;
  });

  /**
   * Required Actions
   */
  describe('Required Actions', () => {
    it('should delete required action by alias', async () => {
      await kcAdminClient.authenticationManagement.deleteRequiredAction({
        alias: RequiredActionAlias.UPDATE_PROFILE,
      });
    });

    it('should get unregistered required actions', async () => {
      const unregisteredReqActions = await kcAdminClient.authenticationManagement.getUnregisteredRequiredActions();
      expect(unregisteredReqActions).to.be.an('array');
      expect(unregisteredReqActions.length).to.be.least(1);
      requiredActionProvider = unregisteredReqActions[0];
    });

    it('should register new required action', async () => {
      const requiredAction = await kcAdminClient.authenticationManagement.registerRequiredAction(
        {
          providerId: requiredActionProvider.providerId,
          name: requiredActionProvider.name,
        },
      );
      expect(requiredAction).to.be.empty;
    });

    it('should get required actions', async () => {
      const requiredActions = await kcAdminClient.authenticationManagement.getRequiredActions();
      expect(requiredActions).to.be.an('array');
    });

    it('should get required action by alias', async () => {
      const requiredAction = await kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: requiredActionProvider.providerId},
      );
      expect(requiredAction).to.be.ok;
    });

    it('should update required action by alias', async () => {
      const requiredAction = await kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: requiredActionProvider.providerId},
      );
      const response = await kcAdminClient.authenticationManagement.updateRequiredAction(
        {alias: requiredActionProvider.providerId},
        {
          ...requiredAction,
          enabled: true,
          priority: 10,
        },
      );
      expect(response).to.be.empty;
    });

    it('should lower required action priority', async () => {
      const requiredAction = await kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: requiredActionProvider.providerId},
      );
      const response = await kcAdminClient.authenticationManagement.lowerRequiredActionPriority(
        {alias: requiredActionProvider.providerId},
      );
      expect(response).to.be.empty;
      const requiredActionUpdated = await kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: requiredActionProvider.providerId},
      );
      expect(requiredActionUpdated.priority).to.be.greaterThan(
        requiredAction.priority,
      );
    });

    it('should raise required action priority', async () => {
      const requiredAction = await kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: requiredActionProvider.providerId},
      );
      const response = await kcAdminClient.authenticationManagement.raiseRequiredActionPriority(
        {alias: requiredActionProvider.providerId},
      );
      expect(response).to.be.empty;
      const requiredActionUpdated = await kcAdminClient.authenticationManagement.getRequiredActionForAlias(
        {alias: requiredActionProvider.providerId},
      );
      expect(requiredActionUpdated.priority).to.be.lessThan(
        requiredAction.priority,
      );
    });

    it('should get client authenticator providers', async () => {
      const createdClient = await kcAdminClient.clients.create({
        clientId: 'testClient',
      });
      const authenticationProviders = await kcAdminClient.authenticationManagement.getClientAuthenticatorProviders(
        {
          id: createdClient.id,
        },
      );

      expect(authenticationProviders.length).to.be.equal(4);
      kcAdminClient.clients.del({id: createdClient.id});
    });
  });
}).timeout(10000);
