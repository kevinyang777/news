import BaseService from './base_service';
import models from '../models';

export default class NewsService extends BaseService {
  /**
   * News specific service class
   */

  constructor() {
    super(models.News);
  }
}
