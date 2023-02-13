import { NextFunction, Response, Request } from 'express';
import LoginService from '../services/login.service';

export default class LoginController {
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

  auth = async () => {
    const { roleUser } = this.req.body;

    const { role } = await this.service.authUser(roleUser);

    return this.res.status(200).json({ role });
  };

  login = async () => {
    const { token } = this.req.body;
    return this.res.status(200).json({ token });
  };
}
