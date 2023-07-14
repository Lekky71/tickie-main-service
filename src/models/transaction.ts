import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';
import { ClerkType, TransactionStatus, TransactionType } from '../interfaces/wallet/transaction';

const TransactionSchema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    }
  },
  user: {
    type: String,
    required: true,
    ref: config.mongodb.collections.users,
  },
  asset: {
    type: String,
    required: true,
    ref: config.mongodb.collections.assets,
  },
  symbol: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TransactionStatus),
    required: false,
  },
  amount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  fee: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  totalAmount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  clerkType: {
    type: String,
    required: true,
    enum: Object.values(ClerkType),
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(TransactionType),
  },
  reason: {
    type: String,
    required: true, // e.g purchasedTicketId
  },
  description: {
    type: String,
  },
  metadata: {
    type: Object,
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
export const TicketDb = mongoose.model(config.mongodb.collections.transactions, TransactionSchema);
