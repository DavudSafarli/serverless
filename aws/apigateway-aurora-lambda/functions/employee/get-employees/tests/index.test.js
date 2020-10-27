import { CONSTANTS, GET_EMP_BY_OFF_ID } from '@mocks/constants';
import { resetAndMockDB } from '@utils/testUtils';

describe('get-employees', () => {
  let event;
  let mocks;

  beforeEach(() => {
    event = require('../data.json');
    mocks = {
      callback: jest.fn()
    };
    jest.spyOn(mocks, 'callback');
  });
  it('should fetch all employees', async () => {
    await resetAndMockDB(mockDbs => {
      mockDbs.employees.findAll = () => [CONSTANTS.employee];
    });
    const handler = require('../index').handler;
    event.body = '{}';
    await handler(event, null, mocks.callback);
    expect(mocks.callback.mock.calls.length).toBe(1);
    expect(mocks.callback.mock.calls[0][0]).toBe(null);
    expect(mocks.callback.mock.calls[0][1]).toBeTruthy();
    expect(mocks.callback.mock.calls[0][1]).toEqual({
      status: 200,
      body: JSON.stringify({ res: [CONSTANTS.employee] })
    });
  });

  it('should fetch all employees of the given officeId', async () => {
    await resetAndMockDB(mockDbs => {
      mockDbs.employeeOffice.findAll = () => [{ dataValues: CONSTANTS.employee }];
    });
    const handler = require('../index').handler;
    await handler(event, null, mocks.callback);
    expect(mocks.callback.mock.calls.length).toBe(1);
    expect(mocks.callback.mock.calls[0][0]).toBe(null);
    expect(mocks.callback.mock.calls[0][1]).toBeTruthy();
    expect(mocks.callback.mock.calls[0][1]).toEqual({
      status: 200,
      body: GET_EMP_BY_OFF_ID
    });
  });

  it('should throw an error when req Id is missing', async () => {
    event.headers['x-ws-system-id'] = null;
    const handler = require('../index').handler;
    await handler(event, null, mocks.callback);
    expect(mocks.callback.mock.calls.length).toBe(1);
    expect(mocks.callback.mock.calls[0][0]).toStrictEqual(`Request Id Missing!`);
    expect(mocks.callback.mock.calls[0][1]).toBe(undefined);
  });
});