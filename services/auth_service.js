import JwtHelper from '../utils/jwt_helper';

export default class AuthService {
  /**
   * Auth specific service class
   */
  constructor() {
    this.jwtHelper = new JwtHelper();
  }

  /**
   * Generate user token to access the main web services.
   * @param {Object} payload
   * @return {String} jwtToken
   */
  generateJWToken(payload) {
    try {
      return this.jwtHelper.createJWT(payload);
    } catch (error) {
      console.log('error message: %s', error.toString());
      throw new Error('error generating the jwt token.');
    }
  }
}
