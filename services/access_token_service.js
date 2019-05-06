import models from '../models';
import BaseService from './base_service';
import csprng from 'csprng';

export default class AccessTokenService extends BaseService {
  /**
   * Access Token specific service class
   */
  constructor() {
    super(models.AccessToken);
  }

  saveToken(userId, accessToken) {
    const refreshToken = csprng(162, 36);
    models.AccessToken.findOne({ where: { userId } }).then(token => {
      if (token) {
        this.update({ accessToken, refreshToken }, { userId });
      } else {
        this.create({ userId, accessToken, refreshToken });
      }
    });
    return refreshToken;
  }
}
