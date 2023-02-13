import { Router } from 'express';
import LoginController from '../controllers/login.controller';
import LoginValidate from '../middlewares/login.validate';

const loginRoutes = Router();

loginRoutes.post(
  '/login',
  (req, res, next) => new LoginValidate(req, res, next).validateLogin(),
  (req, res, next) => new LoginController(req, res, next).login(),
);

loginRoutes.get(
  '/login/validate',
  (req, res, next) => new LoginValidate(req, res, next).validadeAuth(),
  (req, res, next) => new LoginController(req, res, next).auth(),
);

export default loginRoutes;
