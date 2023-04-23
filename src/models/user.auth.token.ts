import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUserAuthToken } from '../interfaces';
import { config } from '../constants/settings';

const userAuthTokenSchema = new mongoose.Schema<IUserAuthToken>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
      },
    },

    token: { type: String, required: true },

    email: { type: String, required: true, lowercase: true, trim: true, unique: true, },

    user: {
      type: String,
      required: true,
      ref: 'users',
    },
    deviceId: {
      type: String,
      required: true,
    },
  },

  {
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
    timestamps: true,
    versionKey: false,
  },
);

// userAuthSchema.plugin(require('mongoose-bcrypt'))

export const UserTokenDb = mongoose.model<IUserAuthToken>(config.mongodb.collections.userAuthTokens, userAuthTokenSchema);
