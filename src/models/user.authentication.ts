import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { config } from '../constants/settings';
import uuid from 'uuid';

const UserAuthSchema = new Schema({
  _id:{
    type: String,
    default:function genUUID(){
      return uuid.v4()
    },
  },
  email: {
    type: String,
    required: true,
    lowerCase: true,
    true:true,
  },
  hashedPassword: {
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
  toObject: {
    transform(doc, ret, _options) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
 toJSON:{
  transform(doc,ret,_options){
    ret.id = ret._id;
    delete ret._id;
    return ret
  },
 },
  timestamps:true,versionKey:false
});

export const userAuthenticationDb = mongoose.model(config.mongodb.collections.userAuthentication,UserAuthSchema)