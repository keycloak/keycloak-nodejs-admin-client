import {KeycloakAdminClient} from '../client';
import {Agent, RequestArgs} from './agent';

export default class Resource {
  private agent: Agent;
  constructor(client: KeycloakAdminClient, settings: {path?: string, urlParams?: any} = {}) {
    this.agent = new Agent({
      client,
      ...settings
    });
  }

  public makeRequest =
    <PayloadType = any, ResponseType = any>(args: RequestArgs): (payload?: PayloadType) => Promise<ResponseType> => {
    return this.agent.request(args);
  }

  // update request will take three types: query, payload and response
  public makeUpdateRequest =
    < QueryType = any,
      PayloadType = any,
      ResponseType = any>(args: RequestArgs): (query: QueryType, payload: PayloadType) => Promise<ResponseType> => {
    return this.agent.updateRequest(args);
  }
}
