import mongoose from 'mongoose';
import { config } from '../constants/settings';
import uuid from 'uuid';

const UserAuthSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuid.v4();
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      true: true,
    },
    password: {
      type: String,
      required: true,
    },
    recognisedDevices: [
      {
        type: String,
        required: true,
      },
    ],
    userId: {
      type: String,
      required: true,
      ref: 'users',
    },
  },
  {
    toObject: {
      transform(doc, ret, _options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret, _options) {
        ret.id = ret._id;
        delete ret._id;
        return ret
      },
    },
    timestamps: true, versionKey: false
  }
);

export const UserAuthDb = mongoose.model(config.mongodb.collections.userAuth, UserAuthSchema);
