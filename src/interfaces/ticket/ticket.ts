import mongoose from 'mongoose';
import { IPagination } from '../IPagination';

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


}

export interface UpdateTicketRequest extends CreateTicketRequest{
  ticket: string;
}


export interface  AllTicketsResponse {
  allTickets : Ticket[]
  pagination :IPagination }

export interface AllTicketsRequest{
  event:string;
  page:number;
  size:number;
  eventType:string;

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
