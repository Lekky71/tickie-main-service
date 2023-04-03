import express from 'express';
import {handleSignUpOtpRequest, handleVerifySignupOtp, handleLoginToAccount} from '../controlllers';


const router = express.Router();

router.post('/otp-request', handleSignUpOtpRequest);
router.post('/otp-verify/signup', handleVerifySignupOtp);

router.post('/login',handleLoginToAccount )

export default router;
