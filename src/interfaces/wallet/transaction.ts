import * as mongoose from 'mongoose';

export interface Transaction extends mongoose.Document {
  // use fields defined in the model
}

// Write enum for Clerk Type
export enum ClerkType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
  PURCHASE = 'PURCHASE',
  WITHDRAWAL_REVERSAL = 'WITHDRAWAL_REVERSAL',
  PURCHASE_REFUND = 'PURCHASE_REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  PROCESSING = 'PROCESSING',
  PROVIDER_PROCESSING = 'PROVIDER_PROCESSING',
}

export abstract class Car {

  constructor(public name: string) {
    this.name = name;
  }

  drive() {
    console.log('Vroom...');
  }

  honk() {
    console.log('Beep...');
  }

  getCarName() {
    return this.name;
  }
}

export class Suv extends Car implements Navigation {

  constructor(name: string) {
    super(name);
  }

  drive() {
    console.log('Vroom... but slower');
  }

  enterDestination(): Promise<string> {
    return Promise.resolve('');
  }

  getCurrentLocation(): Promise<string> {
    return Promise.resolve('');
  }

  getEta(): Promise<number> {
    return Promise.resolve(0);
  }
}


export interface Navigation {
  enterDestination(): Promise<string>;

  getCurrentLocation(): Promise<string>;

  getEta(): Promise<number>;
}

//
// const rx350 = new Suv('Lexus RX 350');
// rx350.honk();
