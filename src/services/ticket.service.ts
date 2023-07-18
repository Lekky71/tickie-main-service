import {TicketDb} from '../models/ticket';
import {EventDb} from '../models/event';
import {BadRequestError,NotFoundError} from '../interfaces';
import {
  CreateTicketRequest,
  Ticket,
  UpdateTicketRequest,
  AllTicketsResponse,
  AllTicketsRequest, TicketDetailsRequest, PurchaseFreeTicketRequest
} from '../interfaces/ticket/ticket';
import { TransactionDb } from '../models/transaction';
import { AssetDb } from '../models/asset';
import { ClerkType, TransactionStatus, TransactionType } from '../interfaces/wallet/transaction';
import { PurchasedTicketDb } from '../models/purchased.ticket';

export async function createTicket(body:CreateTicketRequest):Promise<Ticket>{

  const {user,name,event,description,price,type,total,available,image} = body

  const linkedEvent = await EventDb.findOne({_id:event,creator:user})
  if(!linkedEvent){
    throw new NotFoundError('Unauthorised')
  }


  const ticket = await  TicketDb.create({
    name,
    event,
    image,
    description,
    price,
    type,
    total,
    available,
  })
  return ticket as unknown as Ticket

}

export async function editTicketDetails(body:UpdateTicketRequest):Promise<Ticket>{
  const {user,name,event,description,price,type,total,available,ticket,image} = body

  const linkedEvent = await EventDb.findOne({_id:event,creator:user})
  if(!linkedEvent){
    throw new NotFoundError('Unauthorised')
  }


  await TicketDb.updateOne({id:ticket},{
    name,
    image,
    event,
    description,
    price,
    type,
    total,
    available,
  })

  const editedTicket = await TicketDb.findById(ticket)
  return editedTicket as unknown as Ticket

}

export async function getAllTickets(body:AllTicketsRequest):Promise<AllTicketsResponse>{
  let allTickets

  const {event,page,limit,filter} = body
  const totalTickets = await TicketDb.find<Ticket>({event:event}).countDocuments()

  const totalPages = Math.ceil(totalTickets/limit)
  if(filter){
    allTickets = await TicketDb.find<Ticket>({event: event,type:filter})
    if(!allTickets){
      throw new NotFoundError('No ticket fitting this filter')
    }

  }

  allTickets = await TicketDb.find<Ticket>({event:event}).skip((page - 1) * limit).limit(limit)
  if(!allTickets){
    throw  new NotFoundError('No tickets available')
  }

 return{
    allTickets:allTickets,
    pagination:{
      page:page,
      limit:limit,
      totalCount:totalPages,
    },
 }

}

export async function getTicketDetails(body:TicketDetailsRequest):Promise<Ticket>{
  const {ticket,event} = body

  const Ticket = await TicketDb.findOne<Ticket>({id:ticket,event:event})
  if(!Ticket){
    throw new NotFoundError('Ticket does not exist')
  }

  return Ticket!

}

export async function  deleteTicket(body:TicketDetailsRequest):Promise<void>{
  const {ticket,event} = body

  await TicketDb.findOneAndDelete({id:ticket,event:event})


}


export async function purchaseTicket(body:PurchaseFreeTicketRequest):Promise<void>{
  const {user,event,ticket,email,metadata} = body
  const asset = await AssetDb.findOne({user:user})
  if(!asset){
    throw new NotFoundError('User has not assets')
  }

  const Ticket = await TicketDb.findOne<Ticket>({event:event,id:ticket})
  if(!Ticket){
    throw  new NotFoundError('This ticket does not exist')
  }

  Ticket!.available = +Ticket!.available - 1
  await Ticket.save()

  const transaction = await TransactionDb.create({
    user:user,
    asset:asset?.id,
    symbol:'NGN',
    status: TransactionStatus.SUCCESSFUL,
    amount:0.00,
    fee:0.00,
    totalAmount:0.00,
    clerkType:ClerkType.DEBIT,
    type: TransactionType.PURCHASE,
    reason: ticket,
    description:'Ticket Purchase',
    metadata: metadata
  })

  await PurchasedTicketDb.create({
    ticket,
    purchasedAt:Date.now(),
    buyer:user,
    email:email,
    metadata:metadata,
    transaction: transaction.id,
    used:false

  })



}
