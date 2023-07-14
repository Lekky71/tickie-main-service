import mongoose from 'mongoose';
import { config } from '../constants/settings';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { ClerkType, TransactionStatus, TransactionType } from '../interfaces/wallet/transaction';

const Schema = mongoose.Schema;

const LedgerSchema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    }
  },
  asset: {
    index: true,
    type: String,
    ref: config.mongodb.collections.assets,
    required: true,
  },
  clerkType: {
    type: String,
    enum: Object.values(ClerkType),
    required: true,
  },
  entryType: {
    type: String,
    enum: Object.values(TransactionType),
    required: true,
  },
  transaction: {
    type: String,
    required: true,
    ref: config.mongodb.collections.transactions,
    index: true,
  },
  pendingBalance: {
    type: Number,
    required: true,
  },
  pendingDelta: {
    type: Number,
    required: true,
  },
  availableBalance: {
    type: Number,
    required: true,
  },
  availableDelta: {
    type: Number,
    required: true,
  },
}, {
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  timestamps: true, versionKey: false,
});

export const LedgerDb = mongoose.model(config.mongodb.collections.ledgers, LedgerSchema);

