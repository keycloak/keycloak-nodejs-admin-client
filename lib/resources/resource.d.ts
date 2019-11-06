import { Agent, RequestArgs } from './agent';
export default class Resource<ParamType = {}> {
    agent: Agent;
    basePath: string;
    constructor(agent: Agent, basePath?: string);
    makeRequest: <PayloadType = any, ResponseType_1 = any>(args: RequestArgs) => (payload?: PayloadType & ParamType) => Promise<ResponseType_1>;
    makeUpdateRequest: <QueryType = any, PayloadType = any, ResponseType_1 = any>(args: RequestArgs) => (query: QueryType & ParamType, payload: PayloadType) => Promise<ResponseType_1>;
}
