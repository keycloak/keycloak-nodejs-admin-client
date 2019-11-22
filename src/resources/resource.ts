import urlJoin from 'url-join';
import {KeycloakAdminClient} from '../client';
import {Agent, RequestArgs} from './agent';

export default class Resource<ParamType = {}> {
  public agent: Agent;
  public basePath: string = '';

  constructor(agent: Agent) {
    this.agent = agent;
  }

  public getBaseUrl = (client: KeycloakAdminClient): string => {
    if (this.basePath) {
      return urlJoin(client.baseUrl, this.basePath);
    }

    return client.baseUrl;
  };

  public getUrlParams = (client: KeycloakAdminClient): Record<string, any> => ({
    realm: client.realmName,
  });

  public makeRequest = <PayloadType = any, ResponseType = any>(
    args: RequestArgs,
  ): ((payload?: PayloadType & ParamType) => Promise<ResponseType>) => {
    return this.agent.request({
      resource: this,
      ...args,
    });
  };

  // update request will take three types: query, payload and response
  public makeUpdateRequest = <
    QueryType = any,
    PayloadType = any,
    ResponseType = any
  >(
    args: RequestArgs,
  ): ((
    query: QueryType & ParamType,
    payload: PayloadType,
  ) => Promise<ResponseType>) => {
    return this.agent.updateRequest({
      resource: this,
      ...args,
    });
  };
}
