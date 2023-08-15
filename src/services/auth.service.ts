import { SignupOtpRequest, SignupOtpVerifyRequest, SignUpTokenRequest } from '../interfaces/auth.requests';
import { AuthType, UserAuthDb, UserDb, UserTokenDb, UserVerificationDb } from '../models';
import { BadRequestError, User } from '../interfaces';
import { generateOtp } from '../helpers/Utils';
/** I don't want to bloat everywhere with import from the same folder*/
// import { UserVerificationDb } from '../models/user.verification';
import { JwtType, OtpType, UserVerification } from '../interfaces/user.verification';
import { JwtHelper } from '../helpers/jwt.helper';
import { verifyGoogleToken } from '../helpers/google.helper';
import { config } from '../constants/settings';
import { redisClient } from '../helpers/redis.connector';
import { LoginResponse, SignUpResponse } from '../interfaces/auth.responses';

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient
});

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
    createdAt: { $gte: Date.now() - 60000 }
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
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  });
  // Save the record
  await newVer.save();
  // TODO: Send via email.
}

export async function verifySignupOtp(body: SignupOtpVerifyRequest): Promise<string> {
  const { deviceId, otp } = body;
  let { email } = body;
  email = email.toLowerCase();
  const verification = await UserVerificationDb.findOne<UserVerification>({
    email,
    deviceId,
    otp
  });
  if (!verification) {
    throw new BadRequestError('Invalid OTP');
  } else if (new Date(verification.expiresAt) < new Date()) {
    throw new BadRequestError('OTP has expired');
  }
  // Generate the JWT.
  const token = jwtHelper.generateToken({
    email,
    deviceId,
    type: JwtType.NEW_USER
  });

  // delete used record
  verification.deleteOne();
  return token;
}

export async function signUpWithToken(body: SignUpTokenRequest): Promise<SignUpResponse> {
  const { fullName, password, deviceId } = body;
  let email = body.email.toLowerCase();
  const user = new UserDb({
    email,
    fullName
  });

  const newUser = await user.save();

  const userAuth = new UserAuthDb({
    email,
    password,
    recognisedDevices: deviceId,
    user: newUser._id
  });

  await userAuth.save();

  const accessToken = jwtHelper.generateToken({
    email,
    deviceId,
    type: JwtType.USER,
    userId: newUser._id
  });

  /**for first time login -> upsert-true*/
  const dbSaveRes = await UserTokenDb.create({
    email,
    token: accessToken,
    user: newUser._id,
    deviceId
  });

  return {
    token: dbSaveRes.token,
    user: newUser as unknown as User
  };
}

export async function login(body: { email: string; password: string; deviceId: string }): Promise<LoginResponse> {
  const { password, deviceId } = body;
  /**pull it off separately, so I can change it to lowercase */
  const email = body.email.toLowerCase();

  const existingUserAuth = await UserAuthDb.findOne({ email });

  if (!existingUserAuth || !(await existingUserAuth.verifyPassword(password))) {
    throw new BadRequestError('Invalid login details');
  } else if (!existingUserAuth.recognisedDevices.includes(deviceId)) {
    /** generate, save and send a new verification otp for the user*/
    const otp = generateOtp();

    /**upsert-true...  */
    await UserVerificationDb.updateOne(
      { email },
      {
        email,
        otp,
        deviceId,
        type: OtpType.LOGIN,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        user: existingUserAuth.user
      },
      { upsert: true }
    );

    // send email function goes here

    /**Break execution of the code*/
    throw new BadRequestError('Device not recognised, enter OTP sent to mail to verify');
    /** create a verify otp endpoint to verify the otp*/
  }

  /**generate and save access_token for user*/
  const accessToken = jwtHelper.generateToken({
    email,
    deviceId,
    type: JwtType.USER,
    userId: existingUserAuth.user
  });

  /**for first time login -> upsert-true*/
  await UserTokenDb.updateOne(
    { email, user: existingUserAuth.user },
    {
      email,
      token: accessToken,
      user: existingUserAuth.user,
      deviceId
    },
    { upsert: true }
  );

  const user = await UserDb.findById<User>(existingUserAuth.user);
  return {
    token: accessToken,
    user: user!
  };
}


export async function verifyLoginDeviceOtp(body: {
  otp: string;
  email: string;
  deviceId: string;
  trustDevice: boolean;
}): Promise<LoginResponse> {
  const { otp, email, deviceId, trustDevice } = body;

  /** find userVerification with the provided email
   *  check if user wants to add device as a trusted device
   *  if yes? add to recognised device
   *  return true
   */
  const existingUserVer = await UserVerificationDb.findOne<UserVerification>({ email, otp, type: OtpType.LOGIN });
  if (!existingUserVer) {
    throw new BadRequestError('Token expired or invalid');
  }

  const existingUserAuth = await UserAuthDb.findOne({ email });

  if (!existingUserAuth) {
    throw new BadRequestError('User not found');
  }

  if (trustDevice) {
    existingUserAuth?.recognisedDevices.push(deviceId);
  }

  /**send a login token to the user*/
  const accessToken = jwtHelper.generateToken({
    email,
    deviceId,
    type: JwtType.USER,
    userId: existingUserAuth?.user
  });

  /**for first time login -> upsert-true*/
  await UserTokenDb.updateOne(
    { email, user: existingUserAuth.user },
    {
      email,
      token: accessToken,
      user: existingUserAuth?.user,
      deviceId
    },
    { upsert: true }
  );


  const user = await UserDb.findById<User>(existingUserAuth.user);
  await existingUserVer.deleteOne();
  return {
    token: accessToken,
    user: user!
  };
}

export async function googleAuth(body: {
  email: string;
  googleToken: string;
  deviceId: string;
}): Promise<SignUpResponse> {
  const { googleToken, deviceId } = body;
  /**pull it off separately, so I can change it to lowercase */
  const email = body.email.toLowerCase();

  const existingUserAuth = await UserAuthDb.findOne({ email });

  if (existingUserAuth && existingUserAuth.type === AuthType.EMAIL) {
    throw new BadRequestError('Email already signed up with email and password');
  }

  // If user is already signed up with Google, just return the token.
  if (existingUserAuth) {
    if (!existingUserAuth.recognisedDevices.includes(deviceId)) {
      existingUserAuth.recognisedDevices.push(deviceId);
      await existingUserAuth.save();
    }
    const accessToken = jwtHelper.generateToken({
      email,
      deviceId,
      type: JwtType.USER,
      userId: existingUserAuth.user
    });
    return {
      token: accessToken,
      user: (await UserDb.findById<User>(existingUserAuth.user))!
    };
  }

  // If user is not signed up, sign them up.
  const { email: googleEmail, name, picture } = await verifyGoogleToken(googleToken);
  if (email.toLowerCase() !== googleEmail?.toLowerCase()) {
    throw new BadRequestError('Email does not match Google account');
  }
  // Create the user.
  const newUser = new UserDb({
    fullName: name,
    email,
    avatar: picture
  });
  await newUser.save();
  // Create the user auth.
  const newUserAuth = new UserAuthDb({
    email,
    type: AuthType.GOOGLE,
    user: newUser._id,
    recognisedDevices: [deviceId]
  });
  await newUserAuth.save();

  /**generate and save access_token for user*/
  const accessToken = jwtHelper.generateToken({
    email,
    deviceId,
    type: JwtType.USER,
    userId: newUserAuth.user
  });

  await UserTokenDb.create({
    email,
    token: accessToken,
    user: newUserAuth.user,
    deviceId
  });

  return {
    token: accessToken,
    user: newUser as unknown as User
  };
}
