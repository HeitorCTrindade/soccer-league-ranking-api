import { NextFunction, Response, Request } from 'express';
import LoginService from '../services/login.service';
import isValidEmail from '../helpers/general';
import JWT from '../helpers/JWT';

export default class LoginValidate {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: LoginService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new LoginService();
  }

  validateLogin = async () => {
    const { email, password } = this.req.body;

    if (!email || !password) {
      return this.res
        .status(400).json({ message: 'All fields must be filled' });
    }

    const response = await this.service.login({ email, password });

    if (!isValidEmail(email) || response.isError) {
      return this.res
        .status(401).json({ message: 'Incorrect email or password' });
    }

    this.req.body.token = response.token;
    return this.next();
  };

  validadeAuth = async () => {
    const { authorization } = this.req.headers;

    if (!authorization) {
      return this.res
        .status(400).json({ message: 'Token not found' });
    }

    const decodeToken = JWT.decodeToken(authorization);

    this.req.body.roleUser = decodeToken;

    this.next();
  };
}
