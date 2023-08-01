import { ProviderType } from '../provider.registry';

export interface Receiver {
  id: string;
  type: ProviderType;

  GeneratePaymentLink(body: PaymentRequest): Promise<PaymentResponse>;

  GetTransaction(ref: string): Promise<any>;
}

export type PaymentRequest = {
  amount: number;
  currency: string;
  email: string;
}

export type PaymentResponse = {
  paymentLink: string;
  accessCode?: string;
  reference: string;
}
