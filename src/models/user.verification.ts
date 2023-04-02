import { Schema } from 'mongoose';
import * as crypto from 'crypto';
import * as mongoose from 'mongoose';
import { config } from '../constants/settings';
import { OtpType } from '../interfaces/user.verification';
import { v4 as uuidv4 } from 'uuid';

const UserVerificationSchema = new Schema({
  _id: {
    type: String, default: function genUUID() {
      return uuidv4();
    },
  },
  email: {
    type: String,
    required: true,
    lowerCase: true,
    true: true,
  },
  otp: {
    type: String,
    required: true,
  },
  deviceId: {
    type: String,
    required: true,
  },
  type: {
    type: String, // one of sign-up, login, forgot-password
    enum: Object.keys(OtpType),
    required: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: '10m' },
  },
}, {
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
      return ret;
    },
  },
  timestamps: true, versionKey: false,
});

export const UserVerificationDb = mongoose.model(config.mongodb.collections.userVerifications, UserVerificationSchema);
