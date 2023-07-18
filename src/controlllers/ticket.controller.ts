import {IExpressRequest} from '../interfaces';
import {Request,Response as ExpressResponse} from 'express'
import * as ticketService from '../services/ticket.service'
import * as ResponseManager from '../helpers/response.manager'


export async function handleCreateTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const user = req.userId!
  const {eventId} = req.params
  const {name,description,price,type,total,available} = req.body
  const image = req.file!

  try{

    const ticket = await ticketService.createTicket({user,name,event:eventId,image,description,price,type,total,available})

    ResponseManager.success(res,{ticket})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }
}



// client can use the edit endpoint to also save draft, just set the isDraft field to false
export async function handleEditTicketDetails(req:IExpressRequest,res:ExpressResponse):Promise<void>{

  const {ticketId,eventId} = req.params!
  const image = req.file!



  const user = req.userId!
  const {name,description,price,type,total,available} = req.body

  try{
    const editedTicket = await ticketService.editTicketDetails({name,event:eventId,description,price,type,total,available,ticket:ticketId,user,image})
    ResponseManager.success(res,{editedTicket})

  }catch(err:any){
    ResponseManager.handleError(res,err)
  }


}

export async function handleGetAllTickets(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const {eventId} = req.params
  const {page,limit,filter} = req.query

  try{

    const tickets = await ticketService.getAllTickets({page,limit,filter,event:eventId})
    ResponseManager.success(res,{tickets})

  }catch(err:any){
    ResponseManager.handleError(res,err)
  }

}

export async function handleGetTicketDetails(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const {eventId,ticketId} = req.params

  try{
    const ticketDetails = await ticketService.getTicketDetails({event:eventId,ticket:ticketId})
    ResponseManager.success(res,{ticketDetails})
  }catch(err:any){
    ResponseManager.handleError(res,err)
  }
}

export async function handleDeleteTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const {eventId,ticketId} = req.params
  const user = req.userId!


  try{

    await ticketService.deleteTicket({event:eventId,ticket:ticketId,user})

    ResponseManager.success(res,{message:'Successfully deleted'})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }

}


export async function handlePurchaseTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const user = req.userId!
  const {eventId,ticketId} = req.params
  const {email,metadata} = req.body


  try{
    await ticketService.purchaseTicket({user,event:eventId,ticket:ticketId,email,metadata})
    ResponseManager.success(res,{message:'successfully purchased ticket'})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }
}
