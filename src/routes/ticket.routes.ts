import express from 'express';
import { JwtHelper } from '../helpers/jwt.helper';
import { UserTokenDb } from '../models';
import { redisClient } from '../helpers/redis.connector';
import { JwtType } from '../interfaces/user.verification';
import { config } from '../constants/settings';
import { handleCreateTicket, handleEditTicketDetails } from '../controlllers/ticket.controller';


const router = express.Router({strict:true})

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient

})


router.post('/create-ticket',jwtHelper.requirePermission(JwtType.USER), handleCreateTicket)
router.put('/edit-ticket/:ticketId',jwtHelper.requirePermission(JwtType.USER),handleEditTicketDetails)
router.get('/getAll?page=&limit=&filter=',jwtHelper.requirePermission(JwtType.USER))

export default router
