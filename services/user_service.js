import bcrypt from 'bcrypt';
import csprng from 'csprng';
import BaseService from './base_service';
import models from '../models';

export default class UserService extends BaseService {
  /**
   * User specific service class
   */
  constructor() {
    super(models.User);
  }

  async register(email, password, username, role) {
    const salt = csprng(162, 36);
    const payload = {
      password: bcrypt.hashSync(password + salt, 10),
      salt,
      username,
      email,
      role
    };
    return this.create(payload);
  }

  checkLogin(user, password) {
    return bcrypt.compareSync(password + user.salt, user.password);
  }
}
