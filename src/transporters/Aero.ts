import axios from 'axios';
import type {
  SendSmsResponseT,
  GetStatusResponseT,
  SmsStatusT,
  ProviderI,
  GetCostResponseT,
  GetBalanceResponseT,
} from '../definitions';

type CredentialsT = {
  email: string;
  apiKey: string;
};

export class Aero implements ProviderI {
  credentials: CredentialsT;

  constructor(credentials: CredentialsT) {
    this.credentials = credentials;
  }

  // make request to Aero API
  async _send(
    cmd: 'sms/send' | 'sms/status',
    params: Record<string, any>
  ): Promise<Record<string, any>> {
    const { email, apiKey } = this.credentials || {};
    const extendedParams = {
      ...params,
    };
    const url = `https://${email}:${apiKey}@gate.smsaero.ru/v2/${cmd}`;
    try {
      const res = await axios.get(url, {
        params: extendedParams,
      });
      return res.data;
    } catch (e) {
      return { error: e.response.status, errMsg: e.response.statusText };
    }
  }

  _prepareStatus(status: number): SmsStatusT {
    switch (status) {
      case 2:
        return 'error';
      case 6:
        return 'error';
      case 0:
        return 'pending'; //
      case 4:
        return 'pending'; //  - Waiting for sending
      case 8:
        return 'pending'; //  - Given to operator
      case 1:
        return 'ok'; //  - Delivered
      case 3:
        return 'ok'; //  - Delivered
      default:
        return 'error';
    }
  }

  // send message
  async sendSms(phone: string, message: string): Promise<SendSmsResponseT> {
    const params = {
      number: phone,
      text: message,
      sign: 'SMS Aero',
      channel: 'DIRECT',
    };
    const rawResponse = await this._send('sms/send', params);
    const res = {
      messageId: `${rawResponse.id}-${phone}`,
      rawResponse,
    };
    return res;
  }

  // get status of message (messageId format: id-phoneNumber)
  async getStatus(messageId: string): Promise<GetStatusResponseT> {
    const params = {
      id: messageId.trim().split('-')[0],
    };
    const rawResponse = await this._send('sms/status', params);
    const res = {
      status: this._prepareStatus(rawResponse.status),
      rawResponse,
    };
    return res;
  }

  // get current provider name
  getProviderName(): string {
    return 'Aero';
  }

  async getBalance(): Promise<GetBalanceResponseT> {
    throw new Error(`Aero does not support getting balance`);
  }

  async getCost(_phone: string, _message: string): Promise<GetCostResponseT> {
    throw new Error(`Aero does not support getting cost`);
  }
}
