import { JwtType } from '../interfaces/user.verification';
import * as jwt from 'jsonwebtoken';
import { config } from '../constants/settings';

interface GenerateTokenParam {
  email: string,
  userId?: string;
  type: JwtType;
  deviceId: string;
  expiresIn?: number;
}

export function generateToken(body: GenerateTokenParam): string {
  if (body.type === JwtType.NEW_USER) {
    return jwt.sign({
      email: body.email,
      deviceId: body.deviceId,
      type: JwtType.NEW_USER,
    }, config.jwtPrivateKey, { expiresIn: 60 * 60 });
  }
  throw new Error('type not supported yet');
}
