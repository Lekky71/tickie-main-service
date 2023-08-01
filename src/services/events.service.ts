import { IPagination, NotFoundError } from '../interfaces';
import { EventDb } from '../models';
import { CreateEvent, EditEvent, IEventDocument } from '../interfaces/event/event.interface';


export async function createEvent(body: CreateEvent): Promise<IEventDocument> {
  /**I don't really get the validations you asked me to do boss*/
  return await EventDb.create(body);
}


export async function getAllEvents(body: { page: number, size: number, search: string }): Promise<{
  pagination: IPagination,
  events: IEventDocument[]
}> {
  const { search, page, size } = body;
  const query = { fullName: { $regex: search, $options: 'i' } };
  const count = await EventDb.countDocuments(query);
  const events = await EventDb.find<IEventDocument>(query)
    .skip((page - 1) * size)
    .limit(size);
  return {
    pagination: {
      page,
      size,
      lastPage: Math.ceil(count / size),
      totalCount: count,
    },
    events,
  };
}

export async function getOneEvent(eventId: string): Promise<IEventDocument> {
  const event = await EventDb.findById<IEventDocument>(eventId).populate({
    path: 'creator',
    select: 'email fullName avatar'
  });
  if (!event) {
    throw new NotFoundError('no event found with the provided id');
  }

  return event;
}

/**This will be work in progress*/
export async function updateEvent(filter: { _id: string, creator: string }, body: EditEvent): Promise<IEventDocument> {
  /**I'm not really sure, if a field is undefined or null, mongoose don't bother try updating the filed*/
  const updatedEvent = await EventDb.findByIdAndUpdate<IEventDocument>(filter, body, { new: true });
  if (!updatedEvent) {
    throw new NotFoundError('no event found with the provided id');
  }

  return updatedEvent;
}

/**This will be work in progress*/
export async function deleteEvent(filter: { _id: string, creator: string }): Promise<string> {
  const event = await EventDb.findByIdAndDelete<IEventDocument>(filter);
  if (!event) {
    throw new NotFoundError('no event found with the provided id');
  }

  return 'Event deleted successfully';
}

export function getMyEvents(userId: string): Promise<IEventDocument[]> {
  return EventDb.find({ _id: userId });
}
