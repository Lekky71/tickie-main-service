import * as EventService from '../services/events.service'
import { NextFunction, Response } from 'express';
import { IExpressRequest, } from '../interfaces';
import * as ResponseManager from '../helpers/response.manager';


export async function handleCreateEvent(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // attach user id to the req.body
    req.body.creator = <string>req.userId;
    const draftQueryParam = <string>req.query.draft
    const response = await EventService.createEvent(req.body, draftQueryParam)
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    next(error);
  }
}


export async function handleGetEvents(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await EventService.getEvents(req.query)
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    next(error)
  }
}

export async function handleGetOneEvent(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await EventService.getOneEvent(<string>req.params.eventId);
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    next(error)
  }
}

export async function handleUpdateEvent(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await EventService.updateEvent(<string>req.params.eventId, req.body);
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    next(error)
  }

}

export async function handleDeleteEvent(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await EventService.deleteEvent(<string>req.params.eventId);
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    next(error)
  }
}

export async function handleGetAllDraftEvents(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await EventService.getDraftEvents();
    return ResponseManager.success(res, response);
  } catch (error: unknown) {
    next(error)
  }
}

// I feel the frontend can get each draft out of the array:
