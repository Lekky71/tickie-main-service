import { Router } from 'express';
import * as EventController from '../controlllers/event.controller';

/**strict:true?, we decided to mount routers, to avoid mounted router overlaps*/
const router: Router = Router({ strict: true })


/** params for event is eventId,-> :eventId*/

router.route('/').get(EventController.handleGetEvents).post(EventController.handleGetEvents)

router.route('/:eventId').get(EventController.handleGetOneEvent).delete(EventController.handleDeleteEvent).put(EventController.handleUpdateEvent)

router.get('/drafts', EventController.handleGetAllDraftEvents)
/**we want to mount the ticket router on the event router */
// router.use('/:eventId',tickerRouter)
  //so we can have something like events/:eventId/tickets/:ticketId or
  //events/"eventId/tickets


export const EventRouter = router
