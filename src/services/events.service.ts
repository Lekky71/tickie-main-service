import { IPagination, NotFoundError } from '../interfaces';
import { EventDb } from '../models';
import { IEventDocument } from '../interfaces/event/event.interface';


export async function createEvent(body: IEventDocument, isDraftQuery: string): Promise<IEventDocument> {
  if (isDraftQuery === 'true') {
    body.isDraft = true
  }
  return await EventDb.create(body)
}

export async function getEvents(query: IPagination): Promise<IEventDocument[]> {
  let events: IEventDocument[];
  let filter = { isDraft: false };

  /**I try to figure out the totalCount and LastPage Ipagination interface, but I couldn't figure it out */
  const { page, totalCount, lastPage, size, searchQuery } = query;
  if (searchQuery) {
    // filter[operationId]= 'any filter we want to add to search query'
    events = await EventDb.search(searchQuery, filter)
  } else if (page && size) {
    events = await EventDb.find(filter)
      .limit(+size)
      .skip((+page - 1) * +size);
  } else {
    events = await EventDb.find(filter)
  }

  return events
}

export async function getOneEvent(eventId: string): Promise<IEventDocument> {
  const event = await EventDb.findById<IEventDocument>(eventId);
  if (!event) {
    throw new NotFoundError('no event found with the provided id')
  }

  return event
}

export async function updateEvent(eventId: string, body: IEventDocument): Promise<IEventDocument> {
  const updatedEvent = await EventDb.findByIdAndUpdate<IEventDocument>(eventId, body)
  if (!updatedEvent) {
    throw new NotFoundError('no event found with the provided id')
  }

  return updatedEvent
}

export async function deleteEvent(eventId: string): Promise<string> {
  const event = await EventDb.findByIdAndDelete<IEventDocument>(eventId)
  if (!event) {
    throw new NotFoundError('no event found with the provided id')
  }

  return 'Event deleted successfully';
}

export function getDraftEvents(): Promise<IEventDocument[]> {
  return EventDb.find({ isDraft: true });
}
