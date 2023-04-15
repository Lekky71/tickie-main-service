import { Document } from 'mongoose';

export interface IUserAuthToken extends Document {
  _id: string;
  email: string;
  token: string;
  userId: string;
}
