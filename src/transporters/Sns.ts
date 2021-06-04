import AWS from 'aws-sdk';

import type {
  SendSmsResponseT,
  GetCostResponseT,
  GetStatusResponseT,
  GetBalanceResponseT,
  ProviderI,
} from '../definitions';

type SnsParamsT = {
  accessKeyId?: string;
  secretAccessKey?: string;
  region: string;
};

export class Sns implements ProviderI {
  sns: Record<string, any>;

  constructor(params: SnsParamsT) {
    const { accessKeyId, secretAccessKey, region } = params || {};

    // if credentials were put manually
    if (accessKeyId && secretAccessKey) {
      this.sns = new AWS.SNS({ accessKeyId, secretAccessKey, region });
    } else {
      // if credentials were put in ~/.aws/credentials
      this.sns = new AWS.SNS({ region });
    }
  }

  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const params = {
      Message: message,
      MessageStructure: 'String',
      PhoneNumber: phone,
    };

    const rawResponse = await new Promise<any>((resolve, reject) => {
      this.sns.publish(params, (err: Error | undefined, data: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });

    const res = {
      messageId: rawResponse.MessageId,
      rawResponse,
    };

    return res;
  }

  // get current provider name
  getProviderName(): string {
    return 'sns';
  }

  async getCost(_phone: string, _message: string): Promise<GetCostResponseT> {
    throw new Error(`AWS.SNS does not support getting cost via 'aws-sdk'`);
  }

  async getStatus(_messageId: string): Promise<GetStatusResponseT> {
    throw new Error(`AWS.SNS does not support getting status via 'aws-sdk'`);
  }

  async getBalance(): Promise<GetBalanceResponseT> {
    throw new Error(`AWS.SNS does not support getting balance via 'aws-sdk'`);
  }
}
