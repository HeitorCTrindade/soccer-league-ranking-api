import * as bcrypt from 'bcryptjs';
import JWT from '../helpers/JWT';
import UsersModel from '../database/models/Users';
import { IUserLogin } from '../interfaces/IUserLogin';

export default class LoginService {
  constructor(private userModel = UsersModel) {}

  public async login({ email, password }: IUserLogin) {
    const userLogin = await this.userModel.findOne({ where: { email } });
    if (!userLogin || !bcrypt.compareSync(password, userLogin.password)) {
      return { isError: true };
    }
    const token = JWT.createToken({ id: userLogin.id, email });
    return { token, isError: false };
  }

  public async authUser({ email }: IUserLogin) {
    const { role } = await this.userModel
      .findOne({ where: { email } }) as { role: string };
    return { role };
  }

  static hashHandle(password: string) {
    return bcrypt.hashSync(password);
  }
}
