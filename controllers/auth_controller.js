import {
    AuthService,
    UserService,
    AccessTokenService
  } from '../services/index';
  import ResponseBuilder from '../utils/response_builder';
  
  import BaseController from './base_controller';
  
  export default class AuthController extends BaseController {
    /**
     * Auth controller class
     */
    constructor() {
      super(new AuthService());
      this.userService = new UserService();
      this.accessTokenService = new AccessTokenService();
    }
  
    validatePassword(password) {
      let errorData = [];
      if (!password) return ['password must be provided.'];
      if (password.length < 8)
        errorData.push('password must not be shorter than 8 character.');
      return errorData;
    }
  
    async register(req, res) {
      const { username, email, password, role } = req.body;
      let responseBuilder = new ResponseBuilder();
      let errorData = this.validatePassword(password);
  
      if (errorData.length > 0) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setErrors(errorData)
            .setMessage(errorData[errorData.length - 1])
            .setSuccess(false)
            .build()
        );
        return;
      }
  
      try {
        const result = await this.userService.register(
          email,
          password,
          username,
          role
        );
        this.sendCreatedResponse(
          res,
          responseBuilder
            .setData(result)
            .setMessage('user registered successfully')
            .build()
        );
        return;
      } catch (error) {
        if (error.name == 'SequelizeValidationError') {
          const errorData = error.errors.map(item => {
            return item.message;
          });
          this.sendInvalidPayloadResponse(
            res,
            responseBuilder
              .setErrors(errorData)
              .setMessage(errorData[errorData.length - 1])
              .setSuccess(false)
              .build()
          );
          return;
        } else if (error.name == 'SequelizeUniqueConstraintError') {
          const errorData = error.errors.map(item => {
            return item.message;
          });
          this.sendResourceAlreadyExistResponse(
            res,
            responseBuilder
              .setErrors(errorData)
              .setMessage(errorData[errorData.length - 1])
              .setSuccess(false)
              .build()
          );
          return;
        }
        this.sendResourceAlreadyExistResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage(error.toString())
            .build()
        );
      }
    }
  
    async regenerateToken(req, res) {
      const { refresh_token: refreshToken } = req.body;
      let responseBuilder = new ResponseBuilder();
      if (!refreshToken) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setMessage('Invalid payload provided')
            .setSuccess(false)
            .build()
        );
        return;
      }
  
      try {
        const token = await this.accessTokenService.findOne({
          refreshToken
        });
        if (!token) {
          this.sendNotFoundResponse(
            res,
            responseBuilder
              .setSuccess(false)
              .setMessage('refresh token not found.')
              .build()
          );
          return;
        }
        const user = await this.userService.findOne({ id: token.userId });
        const accessToken = await this.service.generateJWToken({
          email: user.email,
          username: user.username,
          role: user.role,
          id: token.userId
        });
  
        const refresh = this.accessTokenService.saveToken(user.id, accessToken);
        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData({
              access_token: accessToken,
              refresh_token: refresh,
              user
            })
            .setMessage('token refreshed successfully')
            .build()
        );
        return;
      } catch (error) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage(error.toString())
            .build()
        );
      }
    }
  
    async generateToken(req, res) {
      const { email, password } = req.body;
      let responseBuilder = new ResponseBuilder();
      if (!email || !password) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setMessage('Invalid payload provided')
            .setSuccess(false)
            .build()
        );
        return;
      }
      try {
        const user = await this.userService.findOne({ email });
        if (!user) {
          this.sendNotFoundResponse(
            res,
            responseBuilder
              .setSuccess(false)
              .setMessage('has not been registered yet.')
              .build()
          );
          return;
        }
        if (user.deletedAt!==null) {
          this.sendNotFoundResponse(
            res,
            responseBuilder
              .setSuccess(false)
              .setMessage('your account have been disabled')
              .build()
          );
          return;
        }
        if (!this.userService.checkLogin(user, password)) {
          this.sendInvalidPayloadResponse(
            res,
            responseBuilder
              .setSuccess(false)
              .setMessage('invalid username/email and / or password.')
              .build()
          );
          return;
        }
        const token = await this.service.generateJWToken({
          email: user.email,
          role: user.role,
          username: user.username,
          id: user.id
        });
        const refreshToken = this.accessTokenService.saveToken(user.id, token);
  
        this.sendSuccessResponse(
          res,
          responseBuilder
            .setData({
              access_token: token,
              refresh_token: refreshToken,
              user
            })
            .setMessage('token generated successfully')
            .build()
        );
        return;
      } catch (error) {
        this.sendInvalidPayloadResponse(
          res,
          responseBuilder
            .setSuccess(false)
            .setMessage(error.toString())
            .build()
        );
      }
    }
  }
  