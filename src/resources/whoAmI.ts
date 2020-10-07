import WhoAmIRepresentation from '../defs/whoAmIRepresentation';
import Resource from './resource';

export class WhoAmI extends Resource<{realm?: string}> {
  public find = this.makeRequest<{}, WhoAmIRepresentation>({
    method: 'GET',
    path: '/console/whoamI',
  });
}
