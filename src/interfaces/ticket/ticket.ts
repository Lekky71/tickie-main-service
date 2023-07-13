import mongoose from 'mongoose';

export interface Ticket extends mongoose.Document {
  id: string;
  name: string;

}

export enum EventType {
  PAID = 'PAID',
  FREE = 'FREE',
}
