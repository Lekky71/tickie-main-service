import { User } from './user';

export interface SignUpResponse {
  token: string;
  user: User;
}
