import mongoose from 'mongoose';

export interface Ticket extends mongoose.Document {
  id: string;
  user:string
  event:string
  name: string;
  image:string
  description: string;
  price: number;
  type: string;
  total: number;
  available:number;
  isDraft:boolean

}

export enum EventType {
  PAID = 'PAID',
  FREE = 'FREE',
}


export interface CreateTicketRequest{
  user:string;
  name: string;
  image:any;
  event: string;
  description: string;
  price: number;
  type: string;
  total: number;
  available:number;


}

export interface UpdateTicketRequest extends CreateTicketRequest{
  ticket: string;
}


export interface  AllTicketsResponse {
  allTickets : Ticket[]
  pagination : {
    page:number;
    limit:number;
    totalCount:number
  }
}

export interface AllTicketsRequest{
  event:string;
  page:number;
  limit:number;
  filter:string;

}

export interface  TicketDetailsRequest{
  event:string
  ticket:string
}

export interface  DeleteTicketRequest extends TicketDetailsRequest {
  user: string

}

export interface  PurchaseFreeTicketRequest{
  user:string;
  event:string;
  ticket:string;
  email:string;
  metadata?:object;

}
