import AuthController from './auth_controller';
import UserController from './user_controller';
import NewsController from './news_controller';

/**
 * Controller singleton initialization
 */
export const authController = new AuthController();
export const userController = new UserController();
export const newsController = new NewsController();
