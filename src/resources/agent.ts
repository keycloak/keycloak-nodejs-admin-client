import {URL} from 'url';
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

  public request({method, path = '', params, catchNotFound = false}: RequestArgs) {
    return async (payload: any = {}) => {
      const mergedParams = {...this.baseParams, ...pick(payload, params)};
      const newPath = join(this.basePath, path);

      // parse
      const temp = template.parse(newPath);
      const parsedPath = temp.expand(mergedParams);
      const url = `${this.baseUrl}${parsedPath}`;

      // omit payload
      payload = omit(payload, params);
      const requestConfig: AxiosRequestConfig = {
        method,
        url,
        headers: {
          Authorization: `bearer ${this.client.getAccessToken()}`
        }
      };
      if (method === 'GET') {
        requestConfig.params = payload;
      } else {
        requestConfig.data = payload;
      }

      try {
        const res = await axios(requestConfig);
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 404 && catchNotFound) {
          return null;
        }
        throw err;
      }
    };
  }
}
