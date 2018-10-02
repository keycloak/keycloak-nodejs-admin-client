import * as chai from 'chai';
import {getToken} from '../src/utils/auth';
import {credentials} from './constants';

const expect = chai.expect;

describe('Authorization', () => {
  it('should get token from local keycloak', async () => {
    const data = await getToken({
      credentials,
    });

    expect(data).to.have.all.keys(
      'accessToken',
      'expiresIn',
      'refreshExpiresIn',
      'refreshToken',
      'tokenType',
      'notBeforePolicy',
      'sessionState',
      'scope',
    );
  });
});
