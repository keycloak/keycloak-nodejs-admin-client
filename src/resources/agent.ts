import {URL} from 'url';
import {join} from 'path';
import template from 'url-template';
import axios from 'axios';
import {pick, omit} from 'lodash';
import { KeycloakAdminClient } from '../client';

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

  public request({method, path = '', params}: {method: string, path?: string, params?: string[]}) {
    return async (payload: any = {}) => {
      const mergedParams = {...this.baseParams, ...pick(payload, params)};
      const newPath = join(this.basePath, path);

      // parse
      const temp = template.parse(newPath);
      const parsedPath = temp.expand(mergedParams);
      const url = `${this.baseUrl}${parsedPath}`;

      // omit payload
      payload = omit(payload, params);
      const res = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `bearer ${this.client.getAccessToken()}`
        }
      });
      return res.data;
    };
  }
}
