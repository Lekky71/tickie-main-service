import { SignupOtpRequest, SignupOtpVerifyRequest } from '../interfaces/auth.requests';
import { UserAuthDb,UserVerificationDb, UserTokenDb, UserDb } from '../models';
import { BadRequestError, User } from '../interfaces';
import { generateOtp } from '../helpers/Utils';
/** I don't want to bloat everywhere with import from the same folder*/
// import { UserVerificationDb } from '../models/user.verification';
import { JwtType, OtpType } from '../interfaces/user.verification';
import { generateToken } from '../helpers/jwt.helper';

export async function sendSignUoOtp(body: SignupOtpRequest): Promise<void> {
  const { deviceId } = body;
  let { email } = body;
  email = email.toLowerCase();

  // check if email is already in-use.
  const existingAuth = await UserAuthDb.findOne({ email });
  // If in-use, throw error 400
  if (existingAuth) {
    throw new BadRequestError('Email is already in use');
  }

  // We do not want users to request OTP within a minute of already requesting for one.
  const existingVerification = await UserVerificationDb.findOne({
    email,
    deviceId,
    createdAt: { $gte: Date.now() - (60000) }
  });

  if (existingVerification) {
    throw new BadRequestError('OTP has been sent within the minute.');
  }

  // Generate random otp
  const otp = generateOtp();
  const newVer = new UserVerificationDb({
    email,
    otp,
    deviceId,
    type: OtpType.SIGN_UP,
    expiresAt: new Date(Date.now() + (10 * 60 * 1000)),
  });
  // Save the record
  await newVer.save();
  // TODO: Send via email.
}

export async function verifySignupOtp(body: SignupOtpVerifyRequest): Promise<string> {
  const { deviceId, otp } = body;
  let { email } = body;
  email = email.toLowerCase();
  const verification = await UserVerificationDb.findOne({
    email,
    deviceId,
    otp,
  });
  if (!verification) {
    throw new BadRequestError('Invalid OTP');
  } else if (verification.expiresAt < new Date()) {
    throw new BadRequestError('OTP has expired');
  }
  // Generate the JWT.
  const token = generateToken({
    email,
    deviceId,
    type: JwtType.NEW_USER
  });

  // delete used record
  await UserVerificationDb.deleteOne({
    email,
    deviceId,
    otp,
  });
  return token;
}

export async function handleLogin(body:{email:string, password:string, deviceId:string}):Promise<string>{

  const {password, deviceId}=body;
  /**pull it off separately, so I can change it to lowercase */
  const email=body.email.toLowerCase()

  const existingUserAuth=await UserAuthDb.findOne({email})

  if(!existingUserAuth||!(await existingUserAuth.verifyPassword(password))){

    throw  new BadRequestError('Invalid login details');

  }else if (!existingUserAuth.recognisedDevices.includes(deviceId)){
    /** generate, save and send a new verification otp for the user*/
    const otp= generateOtp()

    /**upsert-true...  */
    await UserVerificationDb.updateOne({email}, {
          email, otp, deviceId, type:OtpType.LOGIN,
          expiresAt: new Date(Date.now() + (10 * 60 * 1000)),
          userId:existingUserAuth.userId

      },{upsert:true})

    // send email function goes here

    /**Break execution of the code*/
    throw  new BadRequestError('Device not recognised, enter OTP sent to mail to verify')
    /** create a verify otp endpoint to verify the otp*/
  }

  /**generate and save access_token for user*/
  const accessToken= generateToken(
    {
      email,
      deviceId,
      type: JwtType.USER,
      userId:existingUserAuth.userId
    })

  /**for first time login -> upsert-true*/
  await  UserTokenDb.updateOne({email,userId:existingUserAuth.userId},{
    email,
    token:accessToken,
    userId:existingUserAuth.userId
  },{upsert:true})

  return accessToken
}

export async function handleVerifyLoginDeviceOtp(body:{otp:string, email:string, deviceId:string, trustDevice:boolean}):Promise<string>{
  const {otp, email, deviceId, trustDevice}=body;

  /** find userVerification with the provided email
   *  check if user wants to add device as a trusted device
   *  if yes? add to recognised device
   *  return true
   */
  const existingUserVer= await  UserVerificationDb.findOne({email, otp, type: OtpType.LOGIN});
  if(!existingUserVer)throw new  BadRequestError('Token expired or invalid');

  const existingUserAuth = await UserAuthDb.findOne({email})

  if(trustDevice){
    existingUserAuth?.recognisedDevices.push(deviceId)
  }

  /**send a login token to the user*/
  const accessToken= generateToken(
    {
      email,
      deviceId,
      type: JwtType.USER,
      userId:existingUserAuth?.userId
    })

  /**for first time login -> upsert-true*/
  await  UserTokenDb.updateOne({email,userId:existingUserAuth?.userId},{
    email,
    token:accessToken,
    userId:existingUserAuth?.userId
  },{upsert:true})

  return accessToken
}
