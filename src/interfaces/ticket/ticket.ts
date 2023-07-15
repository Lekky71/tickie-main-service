import mongoose from 'mongoose';

export interface Ticket extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  total: number;
  available:number;

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

}

export interface UpdateTicketRequest extends TicketRequest{
  ticket: string;
}
