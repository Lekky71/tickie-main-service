import * as mongoose from 'mongoose';
import { Schema, } from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';

const PurchasedTicketSchema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    }
  },
  ticket: {
    type: String,
    required: true,
    ref: config.mongodb.collections.tickets,
  },
  purchasedAt: {
    type: Date,
    required: false,
  },
  buyer: {
    type: String,
    required: false,
    ref: config.mongodb.collections.users,
  },
  email: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
  },
  transaction: {
    type: String,
    required: true,
    ref: config.mongodb.collections.transactions,
  },
  used: {
    type: Boolean,
    default: false,
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
export const PurchasedTicketDb = mongoose.model(config.mongodb.collections.purchased_tickets, PurchasedTicketSchema);
