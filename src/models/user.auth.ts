import mongoose from 'mongoose';
import uuid from 'uuid';
import { IUserAuth } from '../interfaces';
import { config } from '../constants/settings';

const userAuthTokenSchema = new mongoose.Schema<IUserAuth>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuid.v4();
      },
    },

    token: { type: String, required: true },

    email: { type: String, required: true, lowercase: true, trim: true },

    userId: {
      //   type: mongoose.Types.ObjectId,
      type: String,
      required: true,
      ref: 'User',
    },

    // password: { type: String, required: true, bcrypt: true, round: 10 },
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

// userAuthSchema.plugin(require('mongoose-bcrypt'))

export const userAuth = mongoose.model<IUserAuth>(config.mongodb.collections.userAuth, userAuthTokenSchema);
