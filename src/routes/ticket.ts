import express from 'express';
import { JwtHelper } from '../helpers/jwt.helper';
import { UserTokenDb } from '../models';
import { redisClient } from '../helpers/redis.connector';
import { JwtType } from '../interfaces/user.verification';
import { config } from '../constants/settings';
import {
  handleCreateTicket,
  handleDeleteTicket,
  handleEditTicketDetails,
  handleGetAllTickets,
  handleGetTicketDetails,
  handlePurchaseTicket
} from '../controlllers/ticket.controller';
import { multerUpload } from '../helpers/inage.uploader';


const router = express.Router({ strict: true, mergeParams: true });

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient

});

// These routes are mounted to a route.use('/events/:eventId') in the events route file
router.post('/', jwtHelper.requirePermission(JwtType.USER), multerUpload.single('ticket'), handleCreateTicket);
router.put('/:ticketId', jwtHelper.requirePermission(JwtType.USER), multerUpload.single('ticket'), handleEditTicketDetails);
router.get('/', jwtHelper.requirePermission(JwtType.USER), handleGetAllTickets);
router.get('/:ticketId', jwtHelper.requirePermission(JwtType.USER), handleGetTicketDetails);
router.delete('/:ticketId', jwtHelper.requirePermission(JwtType.USER), handleDeleteTicket);
router.post('/:ticketId/purchase', jwtHelper.requirePermission(JwtType.GUEST_OR_USER), handlePurchaseTicket);
// TODO: @Dunsimi - Add a route to get a purchased ticket

export default router;
