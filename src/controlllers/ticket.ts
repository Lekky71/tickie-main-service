import {IExpressRequest} from '../interfaces';
import {Request,Response as ExpressResponse} from 'express'
import * as ticketService from '../services/ticket'
import * as ResponseManager from '../helpers/response.manager'


export async function handleCreateTicket(req:IExpressRequest,res:ExpressResponse):Promise<void>{
  const user = req.userId!
  const {name,event,description,price,type,total,available} = req.body

  try{

    await ticketService.createTicket({user,name,event,description,price,type,total,available})

    ResponseManager.success(res,{message:'successfully created event'})

  }catch (err:any){
    ResponseManager.handleError(res,err)
  }
}
