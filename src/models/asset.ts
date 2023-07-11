import mongoose from 'mongoose';
import { config } from '../constants/settings';
import { ActivityStatus } from '../interfaces/asset';
import { v4 as uuidv4 } from 'uuid';

const Schema = mongoose.Schema;

const AssetSchema = new Schema({
  _id: {
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  },
  symbol: {
    type: String,
    required: true,
  },
  user: {
    index: true,
    type: String,
    ref: config.mongodb.collections.users,
    required: true,
  },
  depositActivity: {
    type: String,
    enum: Object.values(ActivityStatus),
    default: ActivityStatus.ACTIVE,
  },
  withdrawalActivity: {
    type: String,
    enum: Object.values(ActivityStatus),
    default: ActivityStatus.ACTIVE,
  },
}, {
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
  versionKey: false,
  timestamps: true,
});

AssetSchema.index({ user: 1, symbol: 1 }, { unique: true });

export const AssetDb = mongoose.model(config.mongodb.collections.assets, AssetSchema);

