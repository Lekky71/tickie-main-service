import { Document } from 'mongoose';

export interface UserVerification extends Document {
  id: string;
  email: string;
  otp: string;
  deviceId: string;
  type: OtpType;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export enum OtpType {
  SIGN_UP = 'SIGN_UP',
  LOGIN = 'LOGIN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum JwtType {
  NEW_USER = 'NEW_USER',
  USER = 'USER',
  TRANSACTING_USER = 'TRANSACTING_USER',
}
