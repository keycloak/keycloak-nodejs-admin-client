import {join} from 'path';
import template from 'url-template';
import axios, { AxiosRequestConfig } from 'axios';
import {pick, omit, isUndefined} from 'lodash';
import { KeycloakAdminClient } from '../client';

export interface RequestArgs {
  method: string;
  path?: string;
  // variables we'll put in url params
  urlParams?: string[];
  // variables we'll put querystring
  querystring?: string[];
  // keyTransform, transform key in payload to other key
  keyTransform?: Record<string, string>;
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
    client, path = '/', urlParams = {}}:
    {client: KeycloakAdminClient, path?: string, urlParams?: Record<string, any>}) {
    this.baseParams = urlParams;
    this.client = client;
    this.baseUrl = client.baseUrl;
    this.basePath = path;
  }

  public request({
    method,
    path = '',
    urlParams = [],
    querystring = [],
    catchNotFound = false,
    keyTransform,
    payloadKey
  }: RequestArgs) {
    return async (payload: any = {}) => {
      const mergedParams = {...this.baseParams, ...pick(payload, urlParams)};
      // prepare queryParams
      const queryParams = querystring ? pick(payload, querystring) : null;
      // omit payload
      payload = omit(payload, [...urlParams, ...querystring]);

      // transform both payload and queryParams
      if (keyTransform) {
        this.transformKey(payload, keyTransform);
        this.transformKey(queryParams, keyTransform);
      }

      return this.requestWithParams({
        method,
        path,
        payload,
        urlParams: mergedParams,
        queryParams,
        catchNotFound,
        payloadKey
      });
    };
  }

  public updateRequest({
    method,
    path = '',
    urlParams = [],
    querystring = [],
    catchNotFound = false,
    keyTransform,
    payloadKey
  }: RequestArgs) {
    return async (query: any = {}, payload: any = {}) => {
      // pick queryParams from query
      const queryParams = querystring ? pick(query, querystring) : null;

      // pick params from query
      const mergedParams = {...this.baseParams, ...pick(query, urlParams)};

      // transform key of queryParams
      if (keyTransform) {
        this.transformKey(queryParams, keyTransform);
      }
      return this.requestWithParams({
        method,
        path,
        payload,
        urlParams: mergedParams,
        catchNotFound,
        queryParams,
        payloadKey
      });
    };
  }

  private async requestWithParams(
    {
      method,
      path,
      payload,
      urlParams,
      queryParams,
      catchNotFound,
      payloadKey
    }:
    {
      method: string,
      path: string,
      payload: any,
      urlParams: any,
      queryParams?: Record<string, any> | null,
      catchNotFound: boolean,
      payloadKey?: string
    }) {
    const newPath = join(this.basePath, path);

    // parse
    const temp = template.parse(newPath);
    const parsedPath = temp.expand(urlParams);
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

    // merged with previous params
    if (queryParams) {
      requestConfig.params = (requestConfig.params) ? {...requestConfig.params, ...queryParams} : queryParams;
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

  private transformKey(payload: any, keyMapping: Record<string, string>) {
    if (!payload) {
      return;
    }

    Object.keys(keyMapping).some(key => {
      if (isUndefined(payload[key])) {
        // skip if undefined
        return false;
      }
      const newKey = keyMapping[key];
      payload[newKey] = payload[key];
      delete payload[key];
    });
  }
}
