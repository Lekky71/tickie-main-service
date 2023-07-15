import {IExpressRequest} from '../interfaces';
import {Request,Response as ExpressResponse} from 'express'
import * as ticketService from '../services/ticket'
import * as ResponseManager from '../helpers/response.manager'


export async function handleCreateTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const user = req.userId!
  const {name,event,description,price,type,total,available} = req.body

  try{

    const ticket = await ticketService.createTicket({user,name,event,description,price,type,total,available})

    ResponseManager.success(res,{ticket})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }
}


export async function handleEditTicketDetails(req:IExpressRequest,res:ExpressResponse):Promise<void>{

  const {ticket} = req.params!
  const user = req.userId!
  const {name,event,description,price,type,total,available} = req.body

  try{
    const editedTicket = await ticketService.editTicketDetails({name,event,description,price,type,total,available,ticket,user})
    ResponseManager.success(res,{editedTicket})

  }catch(err:any){
    ResponseManager.handleError(res,err)
  }


}
