import Resource from './resource';
import ComponentRepresentation from '../defs/componentRepresentation';
import {Agent} from './agent';

export interface ComponentQuery {
  name?: string;
  parent?: string;
  type?: string;
}

export class Components extends Resource<{realm?: string}> {
  /**
   * components
   * https://www.keycloak.org/docs-api/4.1/rest-api/#_component_resource
   */

  public find = this.makeRequest<ComponentQuery, ComponentRepresentation[]>({
    method: 'GET',
  });

  public create = this.makeRequest<ComponentRepresentation, {id: string}>({
    method: 'POST',
    returnResourceIdInLocationHeader: {field: 'id'},
  });

  public findOne = this.makeRequest<{id: string}, ComponentRepresentation>({
    method: 'GET',
    path: '/{id}',
    urlParamKeys: ['id'],
    catchNotFound: true,
  });

  public update = this.makeUpdateRequest<
    {id: string},
    ComponentRepresentation,
    void
  >({
    method: 'PUT',
    path: '/{id}',
    urlParamKeys: ['id'],
  });

  public del = this.makeRequest<{id: string}, void>({
    method: 'DELETE',
    path: '/{id}',
    urlParamKeys: ['id'],
  });

  constructor(
    agent: Agent,
    basePath: string = '/admin/realms/{realm}/components',
  ) {
    super(agent, basePath);
  }
}
