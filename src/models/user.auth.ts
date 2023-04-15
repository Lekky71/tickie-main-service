import mongoose, {Model} from 'mongoose';
import { config } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';




interface IUserAuthDocument {
  _id:string,
  email:string,
  password:string,
  recognisedDevices:string[],
  userId:string,
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
      required: true,
      bcrypt:true,
      rounds:10
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

//no type definition file for this plugin currently
// hence creating the interfaces above
UserAuthSchema.plugin(require('mongoose-bcrypt'))

export const UserAuthDb = mongoose.model<IUserAuthDocument, IUserAuthModel>(config.mongodb.collections.userAuth, UserAuthSchema);
