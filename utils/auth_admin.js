import JwtHelper from './jwt_helper';
import ResponseBuilder from './response_builder';
import { AccessTokenService } from '../services';

export default async (req, res, next) => {
  const { authorization } = req.headers;
  const jwtHelper = new JwtHelper();
  const tokenService = new AccessTokenService();
  let response = new ResponseBuilder();
  if (typeof authorization === 'undefined' || authorization === '') {
    // Auth token not provided
    response
      .setMessage('Authorization header not provided or empty.')
      .setSuccess(false)
      .build();
    res.status(403).json(response);
    return;
  }
  // validate token
  try {
    const token = jwtHelper.parseToken(authorization);

    const result = jwtHelper.verifyJwt(token);
    const user = await tokenService.findOne({ userId: result.id });
    if (!user) {
      response
        .setMessage('User has not logged in yet.')
        .setSuccess(false)
        .build();
      res.status(403).json(response);
      return;
    } else if (result.role != 'admin') {
      response
        .setMessage('User has to be admin to access this')
        .setSuccess(false)
        .build();
      res.status(403).json(response);
      return;
    } else {
      res.locals.user = {
        email: result.email,
        username: result.username,
        id: result.id,
        role: result.role
      };
    }
  } catch (error) {
    res.status(401).json(
      response
        .setData({
          error_type: error.name
        })
        .setMessage(error.message)
        .setSuccess(false)
        .build()
    );
    return;
  }
  next();
};
