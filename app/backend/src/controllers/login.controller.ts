import { RequestHandler } from 'express';
import LoginService from '../services/login.service';
import isValidEmail from '../helpers/general';

export default class LoginController {
  constructor(private serviceLogin = new LoginService()) {}

  validateLogin: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400).json({ message: 'All fields must be filled' });
    }

    if (!isValidEmail(email)  !) {
      return res
        .status(400).json({ message: '"email" must be a valid email' });
    }
    const response = await this.serviceLogin.login(body);
    return next();
  };

  login: RequestHandler = async (req, res) => {
    const { body } = req;
    const response = await this.serviceLogin.login(body);
    return res.status(200).json({ token: response.token });
  };
}
