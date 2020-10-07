import Resource from './resource';
import {ServerInfoRepresentation} from '../defs/serverInfoRepesentation';

export class ServerInfo extends Resource {

  public find = this.makeRequest<{}, ServerInfoRepresentation>({
    method: 'GET',
    path: '/admin/serverinfo'
  });

}
