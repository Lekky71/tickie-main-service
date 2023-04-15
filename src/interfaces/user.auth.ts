import { Document } from 'mongoose';

export interface IUserAuthToken extends Document {
  _id: string;
  email: string;
  token: string;
  user: string;
  deviceId: string;
}
