import { Document, Model, Query } from 'mongoose';

export interface IEventDocument extends Document {
  _id?: string;
  name: string;
  description: string;
  date: Date;
  creator: string;
  endDate: Date | undefined;
  type: string;
  isPublic: boolean;
  location: string;
  isDraft: boolean;
}

export interface IEvent extends IEventDocument {
}

export interface IEventModel extends Model<IEvent> {
  /**takes in Return Type and DocType*/
  search(query: string, option?: any): Query<IEventDocument[], IEventDocument>
}
