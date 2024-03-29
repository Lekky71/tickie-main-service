import { Document, Model } from 'mongoose';

export interface IEventDocument extends Document {
  _id?: string;
  name: string;
  coverImage: string;
  description: string;
  date: Date;
  creator: string;
  endDate: Date;
  type: string;
  isPublic: boolean;
  location: string;
  isDraft: boolean;
}

export interface CreateEvent {
  name: string;
  description: string;
  date: string;
  creator: string;
  endDate: number;
  type: number;
  coverImage?: any;
  isPublic: boolean;
  location: string;
  isDraft: boolean;
}

export interface EditEvent extends CreateEvent {

}

export interface IEvent extends IEventDocument {
}

export interface IEventModel extends Model<IEvent> {
  /**takes in Return Type and DocType*/
}
