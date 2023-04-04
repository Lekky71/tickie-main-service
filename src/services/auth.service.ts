import { SignupOtpRequest, SignupOtpVerifyRequest, SignupTokenRequest } from '../interfaces/auth.requests';
import { UserAuthDb } from '../models/user.auth';
import { UserDb } from '../models/user';
import { BadRequestError } from '../interfaces';
import { generateOtp } from '../helpers/Utils';
import { UserVerificationDb } from '../models/user.verification';
import { JwtType, OtpType } from '../interfaces/user.verification';
import { generateToken, verifyToken } from '../helpers/jwt.helper';
import * as bcrypt from 'bcrypt';

export async function sendSignUoOtp(body: SignupOtpRequest): Promise<void> {
  const { deviceId } = body;
  let { email } = body;
  email = email.toLowerCase();

  // check if email is already in-use.
  const existingAuth = await UserAuthDb.findOne({ email });
  // If in-use, throw error 400
  if (existingAuth) {
    throw new BadRequestError('Email is already in use');
  }

  // We do not want users to request OTP within a minute of already requesting for one.
  const existingVerification = await UserVerificationDb.findOne({
    email,
    deviceId,
    createdAt: { $gte: Date.now() - 60000 },
  });

  if (existingVerification) {
    throw new BadRequestError('OTP has been sent within the minute.');
  }

  // Generate random otp
  const otp = generateOtp();
  const newVer = new UserVerificationDb({
    email,
    otp,
    deviceId,
    type: OtpType.SIGN_UP,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });
  // Save the record
  await newVer.save();
  // TODO: Send via email.
}

export async function verifySignupOtp(body: SignupOtpVerifyRequest): Promise<string> {
  const { deviceId, otp } = body;
  let { email } = body;
  email = email.toLowerCase();
  const verification = await UserVerificationDb.findOne({
    email,
    deviceId,
    otp,
  });
  if (!verification) {
    throw new BadRequestError('Invalid OTP');
  } else if (verification.expiresAt < new Date()) {
    throw new BadRequestError('OTP has expired');
  }
  // Generate the JWT.
  const token = generateToken({
    email,
    deviceId,
    type: JwtType.NEW_USER,
  });

  // delete used record
  await UserVerificationDb.deleteOne({
    email,
    deviceId,
    otp,
  });
  return token;
}

export async function signUpWithToken(body: SignupTokenRequest): Promise<void> {
  const { fullName, password, avatar, authHeader } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = authHeader.split('')[1];
  if(!token){
    throw new BadRequestError('Invalid token');
  }
  const user = verifyToken(token);
  const email = user.email.toLowerCase()

  const newUser = new UserDb({
    email,
    fullName,
    avatar,
  });

  const savedUser = await newUser.save();

  const newAuth = new UserAuthDb({
    email,
    password:hashedPassword,
    recognisedDevices: user.deviceId,
    userId: savedUser._id,
  });

  await newAuth.save()

}
