export type SendSmsResponseT = {
  messageId: string;
  rawResponse: any; // vanilla response from transporter
};

export type GetCostResponseT = {
  cost: string;
  rawResponse: any; // vanilla response from transporter
};

export type SmsStatusT = 'ok' | 'pending' | 'error';
export type GetStatusResponseT = {
  status: SmsStatusT;
  rawResponse: any; // vanilla response from transporter
};

export type GetBalanceResponseT = {
  balance: string;
  rawResponse: any; // vanilla response from transporter
};

export interface ProviderI {
  sendSms(phone: string, message: string): Promise<SendSmsResponseT>;
  getCost(phone: string, message: string): Promise<GetCostResponseT>;
  getStatus(messageId: string): Promise<GetStatusResponseT>;
  getBalance(): Promise<GetBalanceResponseT>;
  getProviderName(): string;
}
