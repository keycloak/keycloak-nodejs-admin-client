import {KeycloakAdminClient} from '../client';
import {Agent} from './agent';

export default class Resource {
  private agent: Agent;
  constructor(client: KeycloakAdminClient, settings: {path?: string, params?: any} = {}) {
    this.agent = new Agent({
      client,
      ...settings
    });
  }

  public makeRequest = <T, R = any>(params: any): (payload?: R) => Promise<T> => {
    return this.agent.request(params);
  }
}
