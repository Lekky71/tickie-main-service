import { Receiver } from './receivers/receiver';
import { Sender } from './senders/sender';
import { PaystackReceiver } from './receivers/paystack.receiver';
import { PaystackSender } from './senders/paystack.sender';

export enum ProviderType {
  SENDER = 'SENDER',
  RECEIVER = 'RECEIVER',
}

export class ProviderRegistry {
  static receivers = new Map<string, Receiver>();
  static senders = new Map<string, Sender>();

  static register(currency: string, provider: Receiver | Sender) {
    if (provider.type === ProviderType.SENDER) {
      this.senders.set(currency, provider as Sender);
    } else {
      this.receivers.set(currency, provider as Receiver);
    }
  }

  static getReceiver(params: { currency: string, type: ProviderType }): Sender | Receiver {
    let provider: undefined | Sender | Receiver;
    switch (params.type) {
      case ProviderType.RECEIVER: {
        provider = this.receivers.get(params.currency);
        break;
      }
      case ProviderType.SENDER: {
        provider = this.senders.get(params.currency);
        break;
      }
      default: {
        throw new Error(`Invalid provider type: ${params.type}`);
      }
    }
    if (!provider) {
      throw new Error(`No provider registered for ${params.currency}`);
    }
    return provider;
  }
}

ProviderRegistry.register('NGN', new PaystackReceiver());
ProviderRegistry.register('NGN', new PaystackSender());
