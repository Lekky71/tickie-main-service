import express from 'express';
import { triangleController } from '../controlllers';

const router = express.Router();

router.post('/otp-request', triangleController.receiveTriangle);

export default router;
