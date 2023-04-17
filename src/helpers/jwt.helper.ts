import { JwtType } from '../interfaces/user.verification';
import * as jwt from 'jsonwebtoken';
import { IExpressRequest } from '../interfaces';
import { Response } from 'express';
import { JwtConfig } from './jwt/types';

interface GenerateTokenParam {
  email: string,
  userId?: string;
  type: JwtType;
  deviceId: string;
  expiresIn?: number;
}


export class JwtHelper {
  private configOption: JwtConfig;
  handleJsonResponse?: Function;
  UserTokenDb: any;

  constructor(configOption: JwtConfig) {
    this.configOption = configOption;
    this.handleJsonResponse = configOption.handleJsonResponse;
    this.UserTokenDb = configOption.UserTokenDb;
  }

  respondError(res: Response, code: number, message: string) {
    if (this.handleJsonResponse) {
      return this.handleJsonResponse(code, message);
    }
    res.status(403).json({ error: true, message });
  }

  generateToken(body: GenerateTokenParam): string {
    if (body.type === JwtType.NEW_USER) {
      return jwt.sign({
        email: body.email,
        deviceId: body.deviceId,
        type: JwtType.NEW_USER
      }, this.configOption.privateKey, { expiresIn: 60 * 60 });
    }

    if (body.type === JwtType.USER) {
      return jwt.sign({
        email: body.email,
        userId: body.userId,
        deviceId: body.email,
        type: JwtType.USER
      }, this.configOption.privateKey, { expiresIn: '1W' });
    }
    throw new Error('type not supported yet');
  }

  async verifyToken(token: string): Promise<GenerateTokenParam> {
    try {
      const result = await jwt.verify(token, Buffer.from(this.configOption.privateKey, 'base64'));
      return result as GenerateTokenParam;
    } catch (error) {
      throw {
        code: 403,
        data: error
      };
    }
  }

  requirePermission(roleType: JwtType) {
    return async (req: IExpressRequest, res: Response, next: Function) => {
      const token = req.headers['x-auth-token'];
      if (!token) {
        return this.respondError(res, 403, 'No API token');
      }
      try {
        if (typeof token !== 'string') {
          return this.respondError(res, 403, 'Auth token is not a valid string');
        }
        // Check if token is valid
        // Check cache first
        const cacheKey = `tickie_token:${token}`;
        const cachedToken = await this.configOption.redisClient.get(cacheKey);
        if (!cachedToken) {
          const dbToken = await this.UserTokenDb.findOne({ token });
          if (!dbToken) {
            return this.respondError(res, 403, 'Invalid token');
          } else {
            await this.configOption.redisClient.set(cacheKey, JSON.stringify(dbToken));
            await this.configOption.redisClient.expire(cacheKey, 60 * 60 * 24 * 7);
          }
        }
        const decoded = await this.verifyToken(token);
        if (roleType !== decoded.type) {
          return this.respondError(res, 403, 'Invalid token');
        }
        req.email = decoded.email;
        if ((decoded.type === JwtType.USER) || (decoded.type === JwtType.TRANSACTING_USER)) {
          req.userId = decoded.userId;
        } else if (decoded.type === JwtType.NEW_USER) {
          req.email = decoded.email;
        } else {
          return this.respondError(res, 403, 'Invalid token');
        }
        return next();

      } catch (error: any) {
        return this.respondError(res, 403, error);
      }
    };
  }
}
