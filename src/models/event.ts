import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';
import { EventType } from '../interfaces/ticket/ticket';

const EventSchema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    }
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: String,
    required: true,
    ref: config.mongodb.collections.users,
  },
  endDate: {
    type: Date,
    required: false,
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(EventType), // PAID, FREE
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  location: {
    type: String,
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
export const EventDb = mongoose.model(config.mongodb.collections.events, EventSchema);
