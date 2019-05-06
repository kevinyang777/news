import { NewsService } from "../services/index";
import ResponseBuilder from "../utils/response_builder";
import BaseController from "./base_controller";

export default class HotelController extends BaseController {
  /**
   * User controller class
   */
  constructor() {
    super(new NewsService());
  }

  async get(req, res) {
    let responseBuilder = new ResponseBuilder();
    const { page, limit, fields, order } = req.query;
    let result = await this.service.paginate(req, page, limit, order, fields);
    this.sendSuccessResponse(
      res,
      responseBuilder
        .setData(result.data)
        .setLinks(result.links)
        .setCount(result.count)
        .setTotal(result.total)
        .setMessage("news fetched successfully")
        .build()
    );
    return;
  }

  async create(req, res) {
    let responseBuilder = new ResponseBuilder();
    const { newsHeader, newsContent, status } = req.body;
    try {
      if (!newsHeader || !newsContent || !status) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage("invalid payload for creating new news")
            .build()
        );
      }
      const payload = {
        newsHeader,
        newsContent,
        status
      };
      const news = await this.service.create(payload);
      this.sendCreatedResponse(
        res,
        responseBuilder
          .setData(news)
          .setMessage("news created")
          .build()
      );
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

  async update(req, res) {
    const { id } = req.params;
    let responseBuilder = new ResponseBuilder();
    const { newsHeader, newsContent, status } = req.body;
    try {
      if (!id || !newsHeader || !newsContent || !status) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage("invalid payload for creating new news")
            .build()
        );
      }
      const payload = {
        newsHeader,
        newsContent,
        status
      };
      const news = await this.service.update(
        payload,
        { id },
        {
          returning: true,
          plain: true
        }
      );
      this.sendSuccessResponse(
        res,
        responseBuilder
          .setData(news)
          .setMessage("news data updated")
          .build()
      );
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

  async delete(req, res) {
    const { id } = req.params;
    let responseBuilder = new ResponseBuilder();
    try {
      await this.service.destroy({ id });

      this.sendSuccessResponse(
        res,
        responseBuilder
          .setMessage("news data deleted successfully")
          .build()
      );
    } catch (error) {
      if (error.message === "data not found") {
        this.sendNotFoundResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage("news not found")
            .build()
        );
        return;
      }
      this.sendInternalServerErrorResponse(
        res,
        responseBuilder
          .setMessage(
            "server error occured when deleting the news data. Please try again later"
          )
          .setSuccess(false)
          .build()
      );
    }
  }
  async find(req, res){
    const { id } = req.params;
    let responseBuilder = new ResponseBuilder();
    try {
      let result = await this.service.findOne({ id });
      if (!result) {
        this.sendNotFoundResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage('news not found')
            .build()
        );
        return;
      }
      this.sendSuccessResponse(
        res,
        responseBuilder
          .setData(result)
          .setMessage('hotel fetched successfully')
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
