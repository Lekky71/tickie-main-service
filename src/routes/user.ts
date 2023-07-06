import express from 'express';
import { JwtHelper } from '../helpers/jwt.helper';
import { config } from '../constants/settings';
import { UserTokenDb } from '../models';
import { redisClient } from '../helpers/redis.connector';
import authRoutes from './auth';
import { JwtType } from '../interfaces/user.verification';
import { handleChangePassword, handleGetMyProfile } from '../controlllers/user.controller';
import { multerUpload } from '../helpers/inage.uploader';

const router = express.Router();

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient,
});

router.use('/auth', authRoutes);

router.get('/me', jwtHelper.requirePermission(JwtType.USER), handleGetMyProfile);

router.put('/me', jwtHelper.requirePermission(JwtType.USER), multerUpload.single('avatar'), handleGetMyProfile);

router.put('/change-password', jwtHelper.requirePermission(JwtType.USER), handleChangePassword);

export default router;
