import {TicketDb} from '../models/ticket';
import {EventDb} from '../models/event';
import {BadRequestError,NotFoundError} from '../interfaces';
import {TicketRequest,Ticket} from '../interfaces/ticket/ticket';

export async function createTicket(body:TicketRequest):Promise<Ticket>{

  const {user,name,event,description,price,type,total,available} = body

  const linkedEvent = await EventDb.findById(event)
  if(linkedEvent?.creator !== user){
    throw new BadRequestError('unauthorised ticket creation')

  }


  const ticket = await  TicketDb.create({
    name,
    event,
    description,
    price,
    type,
    total,
    available
  })
  return ticket as unknown as Ticket

}
