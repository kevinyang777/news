import { UserService } from '../services/index';
import ResponseBuilder from '../utils/response_builder';
import BaseController from './base_controller';

export default class UserController extends BaseController {
  /**
   * User controller class
   */
  constructor() {
    super(new UserService());
  }

  async get(req, res) {
    const { page, limit, fields, order } = req.query;
    let responseBuilder = new ResponseBuilder();
    try {
      const result = await this.service.paginate(
        req,
        page,
        limit,
        order,
        fields
      );

      this.sendSuccessResponse(
        res,
        responseBuilder
          .setData(result.data)
          .setLinks(result.links)
          .setTotal(result.total)
          .setCount(result.count)
          .setMessage('users fetched successfully')
          .build()
      );
      return;
    } catch (error) {
      this.sendBadRequestResponse(
        res,
        responseBuilder
          .setSuccess(false)
          .setMessage(error.toString())
          .build()
      );
    }
  }

  async find(req, res) {
    const { id } = req.params;
    let responseBuilder = new ResponseBuilder();
    try {
      const result = await this.service.findOne({ id });
      if (!result) {
        this.sendNotFoundResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage('user not found')
            .build()
        );
        return;
      }
      this.sendSuccessResponse(
        res,
        responseBuilder
          .setData(result)
          .setMessage('user fetched successfully')
          .build()
      );
      return;
    } catch (error) {
      this.sendBadRequestResponse(
        res,
        responseBuilder
          .setSuccess(false)
          .setMessage(error.toString())
          .build()
      );
    }
  }
}
