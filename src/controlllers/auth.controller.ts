import { IExpressRequest } from '../interfaces';
import { Request, Response as ExpressResponse } from 'express';
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
      deviceId: <string>deviceId
    });
    ResponseManager.success(res, { message: 'OTP sent successfully' });
  } catch (err: any) {
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
      deviceId: <string>deviceId
    });
    ResponseManager.success(res, { token });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleSingnupWithToken(req:IExpressRequest,res: ExpressResponse) : Promise <void>{

  const {fullName,password} = req.body
  const email = req.email
  const deviceId = req.headers['x-device-id'];
  try{
    const user = await authService.handleSingnupWithToken({
      fullName,
      email,
      password,
      deviceId: <string>deviceId,
    });
    ResponseManager.success(res, { user });


  }catch(err:any){
    ResponseManager.handleError(res, err);

  }




}


export async function handleLoginToAccount(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  const deviceId = req.headers['x-device-id'];
  const { email, password } = req.body;
  try {
    const response = await authService.handleLogin({ email, password, deviceId: <string>deviceId });
    ResponseManager.success(res, { response });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleLoginToAccountOtp(req: IExpressRequest, res: ExpressResponse): Promise<void> {
  const deviceId = req.headers['x-device-id'];
  const { email, otp, trustDevice } = req.body;
  try {
    const response = await authService.handleVerifyLoginDeviceOtp({
      otp,
      email,
      deviceId: <string>deviceId,
      trustDevice
    });
    ResponseManager.success(res, { response });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}

export async function handleGoogleAuth(req: Request, res: ExpressResponse): Promise<void> {
  const deviceId = req.headers['x-device-id'];
  const { email, googleToken } = req.body;
  try {
    const response = await authService.googleAuth({
      email,
      deviceId: <string>deviceId,
      googleToken
    });
    ResponseManager.success(res, { response });
  } catch (err: any) {
    ResponseManager.handleError(res, err);
  }
}
