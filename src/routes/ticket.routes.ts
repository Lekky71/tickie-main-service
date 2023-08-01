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
  handleGetTicketDetails, handlePurchaseTicket
} from '../controlllers/ticket.controller';
import { multerUpload } from '../helpers/inage.uploader';


const router = express.Router({ strict: true });

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient

});

// This routes are mounted to a route.use('/events/:eventId') in the events route file
router.post('/tickets', jwtHelper.requirePermission(JwtType.USER), multerUpload.single('ticket'), handleCreateTicket);
router.put('/tickets/:ticketId', jwtHelper.requirePermission(JwtType.USER), multerUpload.single('ticket'), handleEditTicketDetails);
router.get('/tickets', jwtHelper.requirePermission(JwtType.USER), handleGetAllTickets);
router.get('/tickets/:ticketId', jwtHelper.requirePermission(JwtType.USER), handleGetTicketDetails);
router.delete('/tickets/:ticketId', jwtHelper.requirePermission(JwtType.USER), handleDeleteTicket);
router.post('/tickets/:ticketId/purchase', jwtHelper.requirePermission(JwtType.USER), handlePurchaseTicket);


export default router;
