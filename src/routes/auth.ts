import express from 'express';
import { handleSignUpOtpRequest, handleVerifySignupOtp,handleSignUpWithToken } from '../controlllers';

const router = express.Router();

router.post('/otp-request', handleSignUpOtpRequest);
router.post('/otp-verify/signup', handleVerifySignupOtp);
router.post('/signup',handleSignUpWithToken)


export default router;
