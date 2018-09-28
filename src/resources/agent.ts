import urlJoin from 'url-join';
import template from 'url-template';
import axios, {AxiosRequestConfig} from 'axios';
import {pick, omit, isUndefined} from 'lodash';
import {KeycloakAdminClient} from '../client';

export interface RequestArgs {
  method: string;
  path?: string;
  // Keys of url params to be applied
  urlParamKeys?: string[];
  // Keys of query parameters to be applied
  queryParamKeys?: string[];
  // Mapping of key transformations to be performed on the payload
  keyTransform?: Record<string, string>;
  // If responding with 404, catch it and return null instead
  catchNotFound?: boolean;
  // The key of the value to use from the payload of request. Only works for POST & PUT.
  payloadKey?: string;
}

export class Agent {
  private client: KeycloakAdminClient;
  private basePath: string;
  private getBaseParams?: () => Record<string, any>;
  private getBaseUrl?: () => string;
  private requestConfig?: AxiosRequestConfig;

  constructor({
    client,
    path = '/',
    getUrlParams = () => ({}),
    getBaseUrl = () => client.baseUrl,
  }: {
    client: KeycloakAdminClient;
    path?: string;
    getUrlParams?: () => Record<string, any>;
    getBaseUrl?: () => string;
  }) {
    this.client = client;
    this.getBaseParams = getUrlParams;
    this.getBaseUrl = getBaseUrl;
    this.basePath = path;
    this.requestConfig = client.getRequestConfig() || {};
  }

  public request({
    method,
    path = '',
    urlParamKeys = [],
    queryParamKeys = [],
    catchNotFound = false,
    keyTransform,
    payloadKey,
  }: RequestArgs) {
    return async (payload: any = {}) => {
      const baseParams = this.getBaseParams();

      // Filter query parameters by queryParamKeys
      const queryParams = queryParamKeys ? pick(payload, queryParamKeys) : null;

      // Add filtered payload parameters to base parameters
      const allUrlParamKeys = [...Object.keys(baseParams), ...urlParamKeys];
      const urlParams = {...baseParams, ...pick(payload, allUrlParamKeys)};

      // Omit url parameters and query parameters from payload
      payload = omit(payload, [...allUrlParamKeys, ...queryParamKeys]);

      // Transform keys of both payload and queryParams
      if (keyTransform) {
        this.transformKey(payload, keyTransform);
        this.transformKey(queryParams, keyTransform);
      }

      return this.requestWithParams({
        method,
        path,
        payload,
        urlParams,
        queryParams,
        catchNotFound,
        payloadKey,
      });
    };
  }

  public updateRequest({
    method,
    path = '',
    urlParamKeys = [],
    queryParamKeys = [],
    catchNotFound = false,
    keyTransform,
    payloadKey,
  }: RequestArgs) {
    return async (query: any = {}, payload: any = {}) => {
      const baseParams = this.getBaseParams();

      // Filter query parameters by queryParamKeys
      const queryParams = queryParamKeys ? pick(query, queryParamKeys) : null;

      // Add filtered query parameters to base parameters
      const allUrlParamKeys = [...Object.keys(baseParams), ...urlParamKeys];
      const urlParams = {
        ...baseParams,
        ...pick(query, allUrlParamKeys),
      };

      // Transform keys of queryParams
      if (keyTransform) {
        this.transformKey(queryParams, keyTransform);
      }

      return this.requestWithParams({
        method,
        path,
        payload,
        urlParams,
        queryParams,
        catchNotFound,
        payloadKey,
      });
    };
  }

  private async requestWithParams({
    method,
    path,
    payload,
    urlParams,
    queryParams,
    catchNotFound,
    payloadKey,
  }: {
    method: string;
    path: string;
    payload: any;
    urlParams: any;
    queryParams?: Record<string, any> | null;
    catchNotFound: boolean;
    payloadKey?: string;
  }) {
    const newPath = urlJoin(this.basePath, path);

    // Parse template and replace with values from urlParams
    const pathTemplate = template.parse(newPath);
    const parsedPath = pathTemplate.expand(urlParams);
    const url = `${this.getBaseUrl}${parsedPath}`;

    // Prepare request config
    const requestConfig: AxiosRequestConfig = {
      ...this.requestConfig,
      method,
      url,
      headers: {
        Authorization: `bearer ${this.client.getAccessToken()}`,
      },
    };

    // Put payload into querystring if method is GET
    if (method === 'GET') {
      requestConfig.params = payload;
    } else {
      // Set the request data to the payload, or the value corresponding to the payloadKey, if it's defined
      requestConfig.data = payloadKey ? payload[payloadKey] : payload;
    }

    // Concat to existing queryParams
    if (queryParams) {
      requestConfig.params = requestConfig.params
        ? {
            ...requestConfig.params,
            ...queryParams,
          }
        : queryParams;
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
  }

  private transformKey(payload: any, keyMapping: Record<string, string>) {
    if (!payload) {
      return;
    }

    Object.keys(keyMapping).some(key => {
      if (isUndefined(payload[key])) {
        // Skip if undefined
        return false;
      }
      const newKey = keyMapping[key];
      payload[newKey] = payload[key];
      delete payload[key];
    });
  }
}
