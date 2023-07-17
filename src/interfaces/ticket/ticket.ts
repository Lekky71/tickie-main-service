import mongoose from 'mongoose';

export interface Ticket extends mongoose.Document {
  id: string;
  user:string
  event:string
  name: string;
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


export interface TicketRequest{
  user:string;
  name: string;
  event: string;
  description: string;
  price: number;
  type: string;
  total: number;
  available:number;
  isDraft: boolean;

}

export interface UpdateTicketRequest extends TicketRequest{
  ticket: string;
}


export interface  AllTicketsResponse {
  allTickets : Ticket[]
  filteredTickets : Ticket[]
  ticketDrafts: Ticket[]
  totalPages : number
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


export interface  PurchaseFreeTicketRequest{
  user:string;
  event:string;
  ticket:string;
  email:string;
  metadata?:object;

}
