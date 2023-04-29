import express from 'express';
import {
  handleGoogleAuth,
  handleLoginToAccount,
  handleLoginToAccountOtp,
  handleSignUpOtpRequest,
  handleSignupWithToken,
  handleVerifySignupOtp,
  handleForgotPasswordOtpRequest,
  handleVerifyForgotPasswordOtpRequest
} from '../controlllers';
import { JwtHelper } from '../helpers/jwt.helper';
import { config } from '../constants/settings';
import { UserTokenDb } from '../models';
import { redisClient } from '../helpers/redis.connector';
import { JwtType } from '../interfaces/user.verification';


const router = express.Router();

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient,
});

router.post('/otp-request', handleSignUpOtpRequest);
router.post('/otp-verify/signup', handleVerifySignupOtp);

router.post('/login', handleLoginToAccount);

router.post('/signup',
  jwtHelper.requirePermission(JwtType.NEW_USER),
  handleSignupWithToken,
);

router.post('/otp-verify/login', handleLoginToAccountOtp);

router.post('/google-auth', handleGoogleAuth);
router.post('/forgotpassword/otp-request',handleForgotPasswordOtpRequest);
router.post('forgotpassword/otp-verify',handleVerifyForgotPasswordOtpRequest);

export default router;
