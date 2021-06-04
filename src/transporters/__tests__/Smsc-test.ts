import { sandbox, FetchMockSandbox } from 'fetch-mock';
import fetch from 'node-fetch';
import { Smsc } from '../Smsc';

const mockFetch = fetch as any as FetchMockSandbox;
jest.mock('node-fetch', () => sandbox());

describe('Smsc', () => {
  const login = 'SMSC_LOGIN';
  const password = 'SMSC_PASSWORD';
  const smsc = new Smsc({ login, password });

  beforeEach(() => {
    mockFetch.reset();
  });

  // send message
  it('sendSms', async () => {
    mockFetch.mock({
      matcher: `http://smsc.ru/sys/send.php?login=SMSC_LOGIN&psw=SMSC_PASSWORD&phones=77718637484&mes=%D1%82%D1%80%D0%B0%D0%BD%D1%81%D0%BB%D0%B8%D1%82&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: { cnt: 1, id: 50 },
    });

    const res = await smsc.sendSms('77718637484', 'транслит');
    expect(res).toEqual({ messageId: '50-77718637484', rawResponse: { cnt: 1, id: 50 } });
  });

  // get cost of message sending
  it('getCost', async () => {
    mockFetch.mock({
      matcher: `http://smsc.ru/sys/send.php?login=SMSC_LOGIN&psw=SMSC_PASSWORD&cost=1&phones=77718637484&mes=hello&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: { cnt: 1, cost: '0' },
    });

    const res = await smsc.getCost('77718637484', 'hello');
    expect(res).toEqual({ cost: '0', rawResponse: { cnt: 1, cost: '0' } });
  });

  // get status of message with full information
  it('getStatus', async () => {
    mockFetch.mock({
      matcher: `http://smsc.ru/sys/status.php?login=SMSC_LOGIN&psw=SMSC_PASSWORD&id=40&phone=77718637484&all=2&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: {
        cost: '0.00',
        country: 'Казахстан',
        last_date: '13.03.2018 15:50:50',
        last_timestamp: 1520934650,
        message: 'hello',
        operator: 'Beeline',
        phone: '77718637484',
        region: '',
        send_date: '13.03.2018 15:50:46',
        send_timestamp: 1520934646,
        sender_id: 'SMS-CENTRE',
        status: 1,
        status_name: 'Доставлено',
        type: 0,
      },
    });

    const messageId = `40-77718637484`;
    const res = await smsc.getStatus(messageId);
    expect(res).toEqual({
      rawResponse: {
        cost: '0.00',
        country: 'Казахстан',
        last_date: '13.03.2018 15:50:50',
        last_timestamp: 1520934650,
        message: 'hello',
        operator: 'Beeline',
        phone: '77718637484',
        region: '',
        send_date: '13.03.2018 15:50:46',
        send_timestamp: 1520934646,
        sender_id: 'SMS-CENTRE',
        status: 1,
        status_name: 'Доставлено',
        type: 0,
      },
      status: 'ok',
    });
  });

  // get current balance
  it('getBalance', async () => {
    mockFetch.mock({
      matcher: `http://smsc.ru/sys/balance.php?login=SMSC_LOGIN&psw=SMSC_PASSWORD&cur=1&tinyurl=1&charset=utf-8&translit=1&fmt=3`,
      response: { balance: '84.75', currency: 'KZT' },
    });

    const res = await smsc.getBalance();
    expect(res).toEqual({ balance: '84.75', rawResponse: { balance: '84.75', currency: 'KZT' } });
  });
});
