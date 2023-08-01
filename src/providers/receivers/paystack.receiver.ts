import { Paystack } from 'paystack-sdk';

import { PaymentRequest, PaymentResponse, Receiver } from './receiver';
import { BadRequestError, ServiceUnavailableError } from '../../interfaces';
import { ProviderType } from '../provider.registry';
import { Logger } from '../../helpers/Logger';
import { config } from '../../constants/settings';

export class PaystackReceiver implements Receiver {
  id = 'paystack';
  type = ProviderType.RECEIVER;
  paystack: Paystack;

  constructor() {
    this.paystack = new Paystack(config.paystack.secretKey);
  }

  async GeneratePaymentLink(body: PaymentRequest): Promise<PaymentResponse> {
    const { amount, currency, email } = body;
    try {
      const response = await this.paystack.transaction.initialize({
        amount: (amount * 100).toString(),
        currency,
        email,
      });
      if (!response.status || !response.data) {
        throw new ServiceUnavailableError(response.message);
      }
      const { authorization_url, access_code, reference } = response.data;
      return {
        paymentLink: authorization_url,
        accessCode: access_code,
        reference,
      };
    } catch (error: any) {
      if (error.code === 400) {
        throw new BadRequestError(error.message);
      }
      Logger.Error(error.message, error);
      throw new ServiceUnavailableError(error.message);
    }
    throw new Error('Method not implemented.');
  }

  async GetTransaction(ref: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
