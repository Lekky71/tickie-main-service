import express from 'express';
import { handleSignUpOtpRequest, handleVerifySignupOtp } from '../controlllers';

const router = express.Router();

router.post('/otp-request', handleSignUpOtpRequest);
router.post('/otp-verify/signup', handleVerifySignupOtp);

export default router;
