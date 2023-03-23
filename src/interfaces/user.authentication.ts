import { Document } from "mongoose";

export interface UserAuthentication extends Document {
    _id:string;
    email:string;
    hashedPassword:string;
    recognisedDevices:[];
    userId:string;
}