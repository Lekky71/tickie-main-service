import {IExpressRequest} from '../interfaces';
import {Request,Response as ExpressResponse} from 'express'
import * as ticketService from '../services/ticket.service'
import * as ResponseManager from '../helpers/response.manager'


export async function handleCreateTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const user = req.userId!
  const {eventId} = req.params
  const event = eventId
  const {name,description,price,type,total,available,isDraft} = req.body

  try{

    const ticket = await ticketService.createTicket({user,name,event,description,price,type,total,available,isDraft})

    ResponseManager.success(res,{ticket})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }
}



// client can use the edit endpoint to also save draft, just set the isDraft field to false
export async function handleEditTicketDetails(req:IExpressRequest,res:ExpressResponse):Promise<void>{

  const {ticketId,eventId} = req.params!
  const event = eventId
  const ticket = ticketId

  const user = req.userId!
  const {name,description,price,type,total,available,isDraft} = req.body

  try{
    const editedTicket = await ticketService.editTicketDetails({name,event,description,price,type,total,available,ticket,user,isDraft})
    ResponseManager.success(res,{editedTicket})

  }catch(err:any){
    ResponseManager.handleError(res,err)
  }


}

export async function handleGetAllTickets(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const {eventId} = req.params
  const {page,limit,filter} = req.query
  const event = eventId

  try{

    const tickets = await ticketService.getAllTickets({page,limit,filter,event})
    ResponseManager.success(res,{tickets})

  }catch(err:any){
    ResponseManager.handleError(res,err)
  }

}

export async function handleGetTicketDetails(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const {eventId,ticketId} = req.params
  const event = eventId
  const ticket = ticketId

  try{
    const ticketDetails = await ticketService.getTicketDetails({event,ticket})
    ResponseManager.success(res,{ticketDetails})
  }catch(err:any){
    ResponseManager.handleError(res,err)
  }
}

export async function handleDeleteTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const {eventId,ticketId} = req.params
  const event = eventId
  const ticket = ticketId


  try{

    await ticketService.deleteTicket({event,ticket})

    ResponseManager.success(res,{message:'Successfully deleted'})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }

}
