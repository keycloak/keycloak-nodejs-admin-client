import * as chai from 'chai';
import { getToken } from '../src/utils/auth';

const expect = chai.expect;

describe('Authorization', () => {
  it('should get token from local keycloak', async () => {
    const data = await getToken({
      credential: {
        username: 'wwwy3y3',
        password: 'wwwy3y3',
        grantType: 'password',
        clientId: 'admin-cli'
      }
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
