import {KeycloakAdminClient} from '../client';
import {Agent, RequestArgs} from './agent';

export default class Resource<ParamType = {}> {
  public agent: Agent;
  public basePath: string;

  constructor(agent: Agent, basePath: string = '') {
    this.agent = agent;
    this.basePath = basePath;
  }

  public makeRequest = <PayloadType = any, ResponseType = any>(
    args: RequestArgs,
  ): ((payload?: PayloadType & ParamType) => Promise<ResponseType>) => {
    return this.agent.request({
      basePath: this.basePath,
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
      basePath: this.basePath,
      ...args,
    });
  };
}
