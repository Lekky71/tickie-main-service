export interface SignupOtpRequest {
  email: string;
  deviceId: string;
}

export interface SignupOtpVerifyRequest {
  email: string;
  deviceId: string;
  otp: string;
}

export interface SignupTokenRequest{
  fullName:string;
  password:string;
  avatar:string;
  authHeader:string;
}
