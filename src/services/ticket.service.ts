import {TicketDb} from '../models/ticket';
import {EventDb} from '../models/event';
import {BadRequestError,NotFoundError} from '../interfaces';
import {TicketRequest,Ticket,UpdateTicketRequest} from '../interfaces/ticket/ticket';

export async function createTicket(body:TicketRequest):Promise<Ticket>{

  const {user,name,event,description,price,type,total,available,isDraft} = body

  const linkedEvent = await EventDb.findById(event)
  if(!linkedEvent){
    throw new NotFoundError('This event does not exist')
  }
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
    available,
    isDraft
  })
  return ticket as unknown as Ticket

}

export async function editTicketDetails(body:UpdateTicketRequest):Promise<Ticket>{
  const {user,name,event,description,price,type,total,available,ticket,isDraft} = body

  const linkedEvent = await EventDb.findById(event)
  if(!linkedEvent){
    throw new NotFoundError('This event does not exist')
  }
  if(linkedEvent?.creator !== user){
    throw new BadRequestError('unauthorised ticket creation')

  }

  await TicketDb.updateOne({id:ticket},{
    name,
    event,
    description,
    price,
    type,
    total,
    available,
    isDraft
  })

  const editedTicket = await TicketDb.findById(ticket)
  return editedTicket as unknown as Ticket

}
