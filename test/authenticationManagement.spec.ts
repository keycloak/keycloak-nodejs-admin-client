// tslint:disable:no-unused-expression
import * as chai from 'chai';
import {KeycloakAdminClient} from '../src/client';
import {credentials} from './constants';
import faker from 'faker';
import {RequiredActionAlias} from '../src/defs/requiredActionProviderRepresentation';
import {fail} from 'assert';
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
  describe('Flows', () => {
    it('should get the registered form providers', async () => {
      const formProviders = await kcAdminClient.authenticationManagement.getFormProviders();

      expect(formProviders).to.be.ok;
      expect(formProviders.length).to.be.eq(1);
      expect(formProviders[0].displayName).to.be.eq('Registration Page');
    });

    it('should get authentication flow', async () => {
      const flows = await kcAdminClient.authenticationManagement.getFlows();

      expect(flows.map(flow => flow.alias)).to.be.deep.eq(['browser', 'direct grant', 'registration', 'reset credentials',
        'clients', 'first broker login', 'docker auth', 'http challenge']);
    });

    it('should create new authentication flow', async () => {
      const flow = 'test';
      await kcAdminClient.authenticationManagement.createFlow({alias: flow, providerId: 'basic-flow', description: '', topLevel: true, builtIn: false});

      const flows = await kcAdminClient.authenticationManagement.getFlows();
      expect(flows.find(f => f.alias === flow)).to.be.ok;
    });

    const flowName = 'copy of browser';
    it('should copy existing authentication flow', async () => {
      await kcAdminClient.authenticationManagement.copyFlow({flow: 'browser', newName: flowName});

      const flows = await kcAdminClient.authenticationManagement.getFlows();
      const flow = flows.find(f => f.alias === flowName);
      expect(flow).to.be.ok;
    });

    it('should update authentication flow', async () => {
      const flows = await kcAdminClient.authenticationManagement.getFlows();
      const flow = flows.find(f => f.alias === flowName);
      const description = 'Updated description';
      flow.description = description;
      const updatedFlow = await kcAdminClient.authenticationManagement.updateFlow({flowId: flow.id}, flow);

      expect(updatedFlow.description).to.be.eq(description);
    });

    it('should delete authentication flow', async () => {
      let flows = await kcAdminClient.authenticationManagement.getFlows();
      const flow = flows.find(f => f.alias === flowName);
      await kcAdminClient.authenticationManagement.deleteFlow({flowId: flow.id});

      flows = await kcAdminClient.authenticationManagement.getFlows();
      expect(flows.find(f => f.alias === flowName)).to.be.undefined;
    });
  });
  describe('Flow executions', () => {
    it('should fetch all executions for a flow', async () => {
      const executions = await kcAdminClient.authenticationManagement.getExecutions({flow: 'browser'});
      expect(executions.length).to.be.gt(5);
    });

    const flowName = 'executionTest';
    it('should add execution to a flow', async () => {
      await kcAdminClient.authenticationManagement.copyFlow({flow: 'browser', newName: flowName});
      const execution = await kcAdminClient.authenticationManagement.addExecutionToFlow({flow: flowName, provider: 'auth-otp-form'});

      expect(execution.id).to.be.ok;
    });

    it('should add flow to a flow', async () => {
      const flow = await kcAdminClient.authenticationManagement.addFlowToFlow({flow: flowName, alias: 'subFlow', description: '', provider: 'registration-page-form', type: 'basic-flow'});
      const executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      expect(flow.id).to.be.ok;

      expect(executions.map(execution => execution.displayName)).includes('subFlow');
    });

    it('should update execution to a flow', async () => {
      let executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      let execution = executions[executions.length - 1];
      const choice = execution.requirementChoices[1];
      execution.requirement = choice;
      await kcAdminClient.authenticationManagement.updateExecution({flow: flowName}, execution);

      executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      execution = executions[executions.length - 1];

      expect(execution.requirement).to.be.eq(choice);
    });

    it('should delete execution', async () => {
      let executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      const id = executions[0].id;
      await kcAdminClient.authenticationManagement.delExecution({id});
      executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      expect(executions.find(ex => ex.id === id)).to.be.undefined;
    });

    it('should raise priority of execution', async () => {
      let executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      let execution = executions[executions.length - 1];
      const priority = execution.index;
      await kcAdminClient.authenticationManagement.raisePriorityExecution({id: execution.id});

      executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      execution = executions.find(ex => ex.id === execution.id);

      expect(execution.index).to.be.eq(priority - 1);
    });

    it('should lower priority of execution', async () => {
      let executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      let execution = executions[0];
      const priority = execution.index;
      await kcAdminClient.authenticationManagement.lowerPriorityExecution({id: execution.id});

      executions = await kcAdminClient.authenticationManagement.getExecutions({flow: flowName});
      execution = executions.find(ex => ex.id === execution.id);

      expect(execution.index).to.be.eq(priority + 1);
    });

    it('should create, update and delete config for execution', async () => {
      const execution = (await kcAdminClient.authenticationManagement.getExecutions({flow: flowName}))[0];
      const alias = 'test';
      let config = await kcAdminClient.authenticationManagement.createConfig({id: execution.id, alias});
      config = await kcAdminClient.authenticationManagement.getConfig({id: config.id});
      expect(config.alias).to.be.eq(alias);

      const extraConfig = {defaultProvider: 'sdf'};
      await kcAdminClient.authenticationManagement.updateConfig({...config, config: extraConfig});
      config = await kcAdminClient.authenticationManagement.getConfig({id: config.id});

      expect(config.config.defaultProvider).to.be.eq(extraConfig.defaultProvider);

      await kcAdminClient.authenticationManagement.delConfig({id: config.id});
      try {
        await kcAdminClient.authenticationManagement.getConfig({id: config.id});
        fail('should not find deleted config');
      } catch (error) {
        // ignore
      }
    });

    it('should fetch config description for execution', async () => {
      const execution = (await kcAdminClient.authenticationManagement.getExecutions({flow: flowName}))[0];

      const configDescription = await kcAdminClient.authenticationManagement.getConfigDescription({providerId: execution.providerId});
      expect(configDescription).is.ok;
      expect(configDescription.providerId).to.be.eq(execution.providerId);
    });

  });
}).timeout(10000);
