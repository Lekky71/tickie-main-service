import * as EventService from '../services/events.service';
import { NextFunction, Response } from 'express';
import { IExpressRequest, } from '../interfaces';
import * as ResponseManager from '../helpers/response.manager';


export async function handleCreateEvent(req: IExpressRequest, res: Response): Promise<void> {
  req.body.creator = <string>req.userId;
  const { name, description, creator, location, type, isDraft, date, endDate, isPublic, coverImage } = req.body;
  const image = req.file!;
  try {
    const response = await EventService.createEvent(
      { name, description, creator, location, type, isDraft, date, endDate, isPublic, coverImage });
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    ResponseManager.handleError(res, error);
  }
}


export async function handleGetEvents(req: IExpressRequest, res: Response): Promise<void> {
  try {
    const { page, size, search } = req.query;
    const response = await EventService.getAllEvents({ page, size, search });
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    ResponseManager.handleError(res, error);
  }
}

export async function handleGetOneEvent(req: IExpressRequest, res: Response): Promise<void> {
  try {
    const eventId = <string>req.params.eventId;
    const response = await EventService.getOneEvent(eventId);
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    ResponseManager.handleError(res, error);
  }
}

export async function handleUpdateEvent(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, description, creator, location, type, isDraft, date, endDate, isPublic } = req.body;
    const filter = { _id: <string>req.params.eventId, creator: <string>req.userId };
    const response = await EventService.updateEvent(filter, {
      name,
      description,
      creator,
      location,
      type,
      isDraft,
      date,
      endDate,
      isPublic
    });
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    ResponseManager.handleError(res, error);
  }

}

export async function handleDeleteEvent(req: IExpressRequest, res: Response): Promise<void> {
  try {
    const filter = { _id: <string>req.params.eventId, creator: <string>req.userId };
    const response = await EventService.deleteEvent(filter);
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    ResponseManager.handleError(res, error);
  }
}

export async function handleGetMyEvents(req: IExpressRequest, res: Response): Promise<void> {
  try {
    const userId = <string>req.userId;
    const response = await EventService.getMyEvents(userId);
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    ResponseManager.handleError(res, error);
  }
}
