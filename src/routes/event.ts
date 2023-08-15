import { Router } from 'express';
import * as EventController from '../controlllers/event.controller';
import {
  handleCreateEvent,
  handleDeleteEvent,
  handleGetMyEvents,
  handleGetOneEvent,
  handleUpdateEvent
} from '../controlllers/event.controller';
import { JwtType } from '../interfaces/user.verification';
import { JwtHelper } from '../helpers/jwt.helper';
import { config } from '../constants/settings';
import { UserTokenDb } from '../models';
import { redisClient } from '../helpers/redis.connector';
import ticketRoutes from './ticket';

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient,
});

const router: Router = Router();


router.get('/', jwtHelper.requirePermission(JwtType.USER), handleGetMyEvents);

router.post('/', jwtHelper.requirePermission(JwtType.USER), handleCreateEvent);

router.use('/:eventId/tickets', ticketRoutes);

router.get('/explore', EventController.handleGetEvents);

router.get('/:eventId', jwtHelper.requirePermission(JwtType.USER), handleGetOneEvent);

router.delete('/:eventId', jwtHelper.requirePermission(JwtType.USER), handleDeleteEvent);

router.put('/:eventId', jwtHelper.requirePermission(JwtType.USER), handleUpdateEvent);


export const EventRouter = router;
