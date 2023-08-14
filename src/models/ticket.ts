import * as mongoose from 'mongoose';
import { Schema, } from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';
import { EventType } from '../interfaces/ticket/ticket';

const TicketSchema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    }
  },
  name: {
    type: String,
    required: true,
  },
  image:{
    type:String,

  },
  event: {
    type: String,
    required: true,
    ref: config.mongodb.collections.events,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
    default: 0.00,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(EventType), // PAID, FREE
  },
  total: {
    type: Schema.Types.Number,
    required: true,
  },
  available: {
    type: Schema.Types.Number,
    required: true,
  },

}, {
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  timestamps: true, versionKey: false
});

/**same name with user verification, so I change it*/
export const TicketDb = mongoose.model(config.mongodb.collections.tickets, TicketSchema);
