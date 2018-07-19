import {KeycloakAdminClient} from '../client';
import {Agent, RequestArgs} from './agent';

export default class Resource {
  private agent: Agent;
  constructor(client: KeycloakAdminClient, settings: {path?: string, params?: any} = {}) {
    this.agent = new Agent({
      client,
      ...settings
    });
  }

  public makeRequest =
    <PayloadType = any, ResponseType = any>(args: RequestArgs): (payload?: PayloadType) => Promise<ResponseType> => {
    return this.agent.request(args);
  }
}
