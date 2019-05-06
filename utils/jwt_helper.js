import jwt from 'jsonwebtoken';

export default class JwtHelper {
  constructor() {}

  /**
   * Sign new jwt token from passed data.
   * @param {Object} data
   */
  createJWT(data) {
    const options = {
      expiresIn: process.env.JWT_EXPIRATION,
      issuer: 'fakedetik-backend',
      jwtid: 'fakedetik',
      subject: 'fakedetik-access-token'
    };
    return jwt.sign(data, process.env.JWT_SECRET, options);
  }

  /**
   * parse JWT with specified options.
   * @param {String} token
   */
  verifyJwt(token) {
    try {
      const options = {
        expiresIn: process.env.JWT_EXPIRATION,
        issuer: 'fakedetik-backend',
        jwtid: 'fakedetik',
        subject: 'fakedetik-access-token'
      };
      return jwt.verify(token, process.env.JWT_SECRET, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Parse authorization header
   * @param {String} token
   */
  parseToken(token) {
    if (token.includes('bearer ')) {
      return token.slice('bearer '.length);
    }
    throw new Error('invalid token format');
  }
}
