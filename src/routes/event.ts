import { Router } from 'express';
import * as EventController from '../controlllers/event.controller';
import { JwtType } from '../interfaces/user.verification';
import { JwtHelper } from '../helpers/jwt.helper';
import { config } from '../constants/settings';
import { UserTokenDb } from '../models';
import { redisClient } from '../helpers/redis.connector';

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
  redisClient: redisClient,
});

/**strict:true?, we decided to mount routers, to avoid mounted router overlaps*/
const router: Router = Router({ strict: true })


/** params for event is eventId,-> :eventId*/

router.route('/').get(EventController.handleGetEvents)
  .post(jwtHelper.requirePermission(JwtType.SELLER), EventController.handleGetEvents)

router.route('/:eventId').get(EventController.handleGetOneEvent)
  .delete(jwtHelper.requirePermission(JwtType.SELLER), EventController.handleDeleteEvent)
  .put(jwtHelper.requirePermission(JwtType.SELLER), EventController.handleUpdateEvent)

router.get('/drafts', EventController.handleGetAllDraftEvents)
/**we want to mount the ticket router on the event router */
// router.use('/:eventId',tickerRouter)
  //so we can have something like events/:eventId/tickets/:ticketId or
  //events/"eventId/tickets


export const EventRouter = router
