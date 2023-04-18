export interface SignupOtpRequest {
  email: string;
  deviceId: string;
}

export interface SignupOtpVerifyRequest {
  email: string;
  deviceId: string;
  otp: string;
}

export interface SignUpTokenRequest{
  fullName:string;
  password:string;
  email:any;
  deviceId:string;
}