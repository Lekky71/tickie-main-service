import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';
import { EventType } from '../interfaces/ticket/ticket';
import { IEventDocument, IEventModel } from '../interfaces/event/event.interface';

const EventSchema = new Schema<IEventDocument, IEventModel>({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    }
  },
  name: {
    type: String,
    required: true,
    search: true
  },
  description: {
    type: String,
    required: true,
    description: true,
    search: true
  },
  date: {
    type: Date,
    required: true,
    search: true
  },
  creator: {
    index: true,
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
    search: true
  },
  isPublic: {
    type: Boolean,
    default: true,
    search: true
  },
  location: {
    type: String,
    required: true,
    search: true,
  },

  isDraft: {
    type: Boolean,
    default: false
  }
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


EventSchema.plugin(require('mongoose-regex-search'));
/**same name with user verification, so I change it*/
export const EventDb = mongoose.model<IEventDocument, IEventModel>(config.mongodb.collections.events, EventSchema);
