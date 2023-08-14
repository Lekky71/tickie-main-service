import { TicketDb, EventDb } from '../models';
import { BadRequestError, NotFoundError } from '../interfaces';
import {
  AllTicketsRequest,
  AllTicketsResponse,
  CreateTicketRequest,
  DeleteTicketRequest,
  EventType,
  PurchaseFreeTicketRequest,
  Ticket,
  TicketDetailsRequest,
  UpdateTicketRequest
} from '../interfaces/ticket/ticket';
import { PurchasedTicketDb } from '../models/purchased.ticket';

export async function createTicket(body: CreateTicketRequest): Promise<Ticket> {

  const { user, name, event, description, price, type, total, image } = body;

  const linkedEvent = await EventDb.findOne({ _id: event, creator: user });
  if (!linkedEvent) {
    throw new NotFoundError('Unauthorised');
  }

  const ticket = await TicketDb.create({
    name,
    event,
    image,
    description,
    price,
    type,
    total,
    available: total,
  });


  return (await TicketDb.findById<Ticket>(ticket.id))!.toObject();

}

export async function editTicketDetails(body: UpdateTicketRequest): Promise<void> {
  const { user, name, event, description, price, type, total, ticket, image } = body;

  const linkedEvent = await EventDb.findOne({ _id: event, creator: user });
  if (!linkedEvent) {
    throw new NotFoundError('Not found');
  }

  await TicketDb.updateOne({ _id: ticket }, {
    name,
    image,
    event,
    description,
    price,
    type,
    total,
  });
  return;
}

export async function getAllTickets(body: AllTicketsRequest): Promise<AllTicketsResponse> {
  let allTickets;

  const { event, page, size, eventType } = body;
  const totalTickets = await TicketDb.find<Ticket>({ event: event }).countDocuments();

  const totalPages = Math.ceil(totalTickets / size);
  if (eventType) {
    allTickets = await TicketDb.find<Ticket>({ event: event, type: eventType });
    if (!allTickets) {
      throw new NotFoundError('No ticket fitting this filter');
    }

  }

  allTickets = await TicketDb.find<Ticket>({ event: event }).skip((page - 1) * size).limit(size);
  if (!allTickets) {
    throw  new NotFoundError('No tickets available');
  }

  return {
    allTickets: allTickets,
    pagination: {
      page: page,
      size: size,
      totalCount: totalTickets,
      lastPage: totalPages,
    },
  };

}

export async function getTicketDetails(body: TicketDetailsRequest): Promise<Ticket> {
  const { ticket, event } = body;

  const Ticket = await TicketDb.findOne<Ticket>({ _id: ticket, event: event });
  if (!Ticket) {
    throw new NotFoundError('Ticket does not exist');
  }

  return Ticket!;

}

export async function deleteTicket(body: DeleteTicketRequest): Promise<void> {
  const { ticket, event, user } = body;

  const hasBeenBought = await PurchasedTicketDb.findOne({ ticket });
  if (hasBeenBought) {
    throw new BadRequestError('Ticket cannot be deleted');
  }

  const linkedEvent = await EventDb.findById(event);
  if (linkedEvent?.creator !== user) {
    throw new BadRequestError('Unauthorised');

  }

  await TicketDb.findOneAndDelete({ _id: ticket, event: event });

}


export async function purchaseTicket(body: PurchaseFreeTicketRequest): Promise<void> {
  const { user, event, ticket, email, metadata } = body;

  const linkedTicket = await TicketDb.findById<Ticket>(ticket);
  // I tried to access the event type after populating with {linkedTicket.event.type}
  // but typescript kept throwing an error
  const linkedEvent = await EventDb.findById(event);
  if (!linkedTicket) {
    throw new NotFoundError('Ticket does not exist');
  }

  if (!linkedEvent) {
    throw new NotFoundError('Event does not exist');
  }

  if (linkedEvent.type === EventType.FREE) {
    linkedTicket!.available = +linkedTicket!.available - 1;
    await linkedTicket!.save();

    await PurchasedTicketDb.create({
      ticket,
      purchasedAt: Date.now(),
      buyer: user,
      email: email,
      metadata: metadata,
      // transaction: , FREE
      used: false

    });
  }
}
