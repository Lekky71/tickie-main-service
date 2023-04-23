import { User } from './user';

export interface SignUpResponse {
  token: string;
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}
