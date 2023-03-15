import { Document } from 'mongoose';

export interface IUserAuth extends Document {
  _id: string;
  email: string;
  token: string;
  userId: string;
}
