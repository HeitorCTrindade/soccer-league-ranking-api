import * as jwt from 'jsonwebtoken';
import { IUserToken } from '../interfaces/IUserToken';

export default class JWT {
  private static secret: jwt.Secret = process.env.JWT_SECRET || 'jwt_secret';
  private static config: jwt.SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  static createToken(payload: IUserToken) {
    return jwt.sign({ ...payload }, this.secret, this.config);
  }

  static decodeToken(token: string) {
    return jwt.verify(token, this.secret);
  }
}
