import * as chai from 'chai';
import { getToken } from '../src/utils/auth';
import { cred } from './constants';

const expect = chai.expect;

describe('Authorization', () => {
  it('should get token from local keycloak', async () => {
    const data = await getToken({
      credential: cred
    });

    expect(data).to.have.all.keys(
      'accessToken',
      'expiresIn',
      'refreshExpiresIn',
      'refreshToken',
      'tokenType',
      'notBeforePolicy',
      'sessionState',
      'scope'
    );
  });
});
