import { ResolveBankDetailsRequest, ResolveBankDetailsResponse, Sender, TransferRequest } from './sender';
import { ProviderType } from '../provider.registry';

export class PaystackSender implements Sender {
  id = 'paystack';
  type = ProviderType.SENDER;

  async GetTransaction(ref: string): Promise<any> {
  }

  async ResolveBankDetails(body: ResolveBankDetailsRequest): Promise<ResolveBankDetailsResponse> {
    throw new Error('Method not implemented.');
  }

  async Transfer(body: TransferRequest): Promise<string> {
    throw new Error('Method not implemented.');
  }

}
