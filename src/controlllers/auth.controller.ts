import { IExpressRequest } from '../interfaces';
import { Response as ExpressResponse } from 'express';
import * as authService from '../services/auth.service';
import * as ResponseManager from '../helpers/response.manager';

export async function handleSignUpOtpRequest(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  const { email } = req.body;
  const deviceId = req.headers['x-device-id'];

  // service layer
  // Get result from service layer.
  // handle errors
  // send response
  try {
    await authService.sendSignUoOtp({
      email,
      deviceId: <string>deviceId,
    });
    ResponseManager.success(res, { message: 'OTP sent successfully' });
  } catch (err) {
    // Error handling
    ResponseManager.handleError(res, err);
  }
}

export async function handleVerifySignupOtp(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  const { email, otp } = req.body;
  const deviceId = req.headers['x-device-id'];

  try {
    const token = await authService.verifySignupOtp({
      email,
      otp,
      deviceId: <string>deviceId,
    });
    ResponseManager.success(res, { token });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}

export async function signUpWithToken(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  const { fullName, password, avatar } = req.body;
  const authHeader = req.headers['authorization'];

  try {
    await authService.signUpWithToken({
      fullName,
      password,
      avatar,
      authHeader: <string>authHeader,
    });
    ResponseManager.success(res, { message: 'User created successfully' });
  } catch (err) {
    ResponseManager.handleError(res, err);
  }
}
