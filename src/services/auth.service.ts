import { SignupOtpRequest } from '../interfaces/auth.requests';
import { UserAuthDb } from '../models/user.auth';
import { BadRequestError } from '../interfaces';
import { generateOtp } from '../helpers/Utils';
import { UserVerificationDb } from '../models/user.verification';
import { OtpType } from '../interfaces/user.verification';

export async function sendSignUoOtp(body: SignupOtpRequest): Promise<boolean> {
  const { deviceId } = body;
  let { email } = body;
  email = email.toLowerCase();

  // check if email is already in-use.
  const existingAuth = await UserAuthDb.findOne({ email });
  // If in-use, throw error 400
  if (existingAuth) {
    throw new BadRequestError('Email is already in use');
  }
  // Generate random otp
  const otp = generateOtp();
  const newVer = new UserVerificationDb({
    email,
    otp,
    deviceId,
    type: OtpType.SIGN_UP,
    expiresAt: new Date(Date.now() + (10 * 60 * 1000)),
  });
  // Save the record
  await newVer.save();
  // Send via email.
  return true;
}
