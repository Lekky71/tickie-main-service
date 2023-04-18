import mongoose, { Model } from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';

export enum AuthType {
  EMAIL = 'email',
  GOOGLE = 'google',
}
interface IUserAuthDocument {
  _id: string,
  email: string,
  password: string,
  recognisedDevices: string[],
  user: string,
  type: AuthType,
}

interface IUserAuth extends IUserAuthDocument {
  verifyPassword(arg: string): boolean;
}

interface IUserAuthModel extends Model<IUserAuth> {

}

const UserAuthSchema = new mongoose.Schema<IUserAuthDocument, IUserAuthModel>(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuidv4();
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
      required: false,
      bcrypt: true,
      rounds: 10
    },
    recognisedDevices: [
      {
        type: String,
        required: true
      }
    ],
    user: {
      type: String,
      required: true,
      ref: 'users'
    },
    type: {
      type: String,
      enum: Object.values(AuthType),
      default: AuthType.EMAIL
    }
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
    timestamps: true, versionKey: false
  }
);

//no type definition file for this plugin currently
// hence creating the interfaces above
UserAuthSchema.plugin(require('mongoose-bcrypt'));

export const UserAuthDb = mongoose.model<IUserAuthDocument, IUserAuthModel>(config.mongodb.collections.userAuth, UserAuthSchema);
