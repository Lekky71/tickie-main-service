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
