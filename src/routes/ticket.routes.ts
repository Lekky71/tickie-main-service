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
  handleGetTicketDetails, handlePurchaseFreeTicket
} from '../controlllers/ticket.controller';


const router = express.Router({strict:true})

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient

})

// This routes are mounted to a route.use('/events/:eventId/tickets') in the events route file
router.post('/create-ticket',jwtHelper.requirePermission(JwtType.USER), handleCreateTicket)
router.put('/edit-ticket/:ticketId',jwtHelper.requirePermission(JwtType.USER),handleEditTicketDetails)
router.get('/getAll?page=&limit=&filter=',jwtHelper.requirePermission(JwtType.USER),handleGetAllTickets)
router.get(':ticketId',jwtHelper.requirePermission(JwtType.USER),handleGetTicketDetails)
router.delete(':ticketId',jwtHelper.requirePermission(JwtType.USER),handleDeleteTicket)
router.post(':ticketId/purchase-free',jwtHelper.requirePermission(JwtType.USER),handlePurchaseFreeTicket)


export default router
