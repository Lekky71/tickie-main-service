import express from 'express';
import {
  handleSignUpOtpRequest,
  handleVerifySignupOtp,
  handleLoginToAccount,
  handleLoginToAccountOtp
} from '../controlllers';


const router = express.Router();

router.post('/otp-request', handleSignUpOtpRequest);
router.post('/otp-verify/signup', handleVerifySignupOtp);

router.post('/login', handleLoginToAccount);
router.post('/otp-verify/login', handleLoginToAccountOtp);

router.post('/google-auth', handleLoginToAccountOtp);

export default router;
