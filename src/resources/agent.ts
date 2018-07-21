import {join} from 'path';
import template from 'url-template';
import axios, { AxiosRequestConfig } from 'axios';
import {pick, omit} from 'lodash';
import { KeycloakAdminClient } from '../client';

export interface RequestArgs {
  method: string;
  path?: string;
  params?: string[];
  // if respond with 404, catch it and return null instead
  catchNotFound?: boolean;
  // the exact key we extract to payload of request
  // only works for POST, PUT
  payloadKey?: string;
}

export class Agent {
  private client: KeycloakAdminClient;
  private baseUrl: string;
  private basePath: string;
  private baseParams?: Record<string, any>;

  constructor({
    client, path = '/', params = {}}:
    {client: KeycloakAdminClient, path?: string, params?: Record<string, any>}) {
    this.baseParams = params;
    this.client = client;
    this.baseUrl = client.baseUrl;
    this.basePath = path;
  }

  public request({method, path = '', params, catchNotFound = false, payloadKey}: RequestArgs) {
    return async (payload: any = {}) => {
      const mergedParams = {...this.baseParams, ...pick(payload, params)};
      // omit payload
      payload = omit(payload, params);
      return this.requestWithParams({
        method,
        path,
        payload,
        params: mergedParams,
        catchNotFound,
        payloadKey
      });
    };
  }

  public updateRequest({method, path = '', params, catchNotFound = false, payloadKey}: RequestArgs) {
    return async (query: any = {}, payload: any = {}) => {
      // pick params from query
      const mergedParams = {...this.baseParams, ...pick(query, params)};
      return this.requestWithParams({
        method,
        path,
        payload,
        params: mergedParams,
        catchNotFound,
        payloadKey
      });
    };
  }

  private async requestWithParams(
    {method, path, payload, params, catchNotFound, payloadKey}:
    {method: string, path: string, payload: any, params: any, catchNotFound: boolean, payloadKey?: string}) {
    const newPath = join(this.basePath, path);

    // parse
    const temp = template.parse(newPath);
    const parsedPath = temp.expand(params);
    const url = `${this.baseUrl}${parsedPath}`;

    // prepare request configs
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      headers: {
        Authorization: `bearer ${this.client.getAccessToken()}`
      }
    };

    // put payload into querystring if method is GET
    if (method === 'GET') {
      requestConfig.params = payload;
    } else {
      // consider payloadKey here
      requestConfig.data = payloadKey ? payload[payloadKey] : payload;
    }

    try {
      // console.log(requestConfig);
      const res = await axios(requestConfig);
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 404 && catchNotFound) {
        return null;
      }
      throw err;
    }
  }
}
