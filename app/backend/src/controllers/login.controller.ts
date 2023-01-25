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

    const response = await this.serviceLogin.login({ email, password });

    if (!isValidEmail(email) || response.isError) {
      return res
        .status(401).json({ message: 'Incorrect email or password' });
    }

    req.body.token = response.token;
    return next();
  };

  login: RequestHandler = async (req, res) => {
    const { token } = req.body;
    return res.status(200).json({ token });
  };
}
