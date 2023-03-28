import { IExpressRequest } from '../interfaces';
import { Response as ExpressResponse } from 'express';
import * as authService from '../services/auth.service';

export async function handleSignUpOtpRequest(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  const { email } = req.body;
  const deviceId = req.headers['x-device-id'];

  // service layer
  // Get result from service layer.
  // handle errors
  // send response
  try {
    const result = await authService.sendSignUoOtp({
      email,
      deviceId: <string>deviceId,
    });
  } catch (err: any) {

  }
}
