import { ProviderType } from '../provider.registry';

export interface Sender {
  id: string;
  type: ProviderType;

  ResolveBankDetails(body: ResolveBankDetailsRequest): Promise<ResolveBankDetailsResponse>;

  Transfer(body: TransferRequest): Promise<string>;

  GetTransaction(ref: string): Promise<any>;
}

export type ResolveBankDetailsRequest = {
  accountNumber: string;
  bankCode: string;
};

export type ResolveBankDetailsResponse = ResolveBankDetailsRequest & {
  name: string;
};

export type TransferRequest = {
  amount: number;
  currency: string;
  email: string;
  recipientId: string;
};
