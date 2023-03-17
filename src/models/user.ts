import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { config } from '../constants/settings';
import uuid from 'uuid';

const UserSchema = new Schema(
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
      lowerCase: true,
      true: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    avatar: String,
  },
  {
    toObject: {
      transform(doc, ret /**_options */) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret /**_options */) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
    versionKey: false,
  },
);

export const UserVerificationDb = mongoose.model(config.mongodb.collections.users, UserSchema);