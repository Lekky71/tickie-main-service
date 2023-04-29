import { User } from './user';

export interface SignUpResponse {
  token: string;
  user: User;
}

export interface ResetPasswordResponse{
  token: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
