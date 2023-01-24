import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import UsersModel from '../database/models/Users';
import { UserLogin } from '../interfaces/UserLogin';

export default class LoginService {
  constructor(private userModel = UsersModel) {}

  public async login({ email, password }: UserLogin) {
    const encryptedPassword = LoginService.hashHandle(password);
    const userLogin = await this.userModel.findOne({ where: { email } });
    if (!userLogin || !bcrypt.compareSync(password, userLogin.password)) {
      return { isError: true };
    }
    jwt.
    return { token, isError: false };
  }

  static hashHandle(password: string) {
    return bcrypt.hashSync(password);
  }
}
