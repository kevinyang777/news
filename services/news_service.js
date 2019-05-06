import BaseService from './base_service';
import models from '../models';

export default class HotelService extends BaseService {
  /**
   * Hotel specific service class
   */

  constructor() {
    super(models.News);
  }
}
