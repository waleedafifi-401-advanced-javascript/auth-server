'use strict';

require('dotenv').config();
const supergoose = require('@code-fellows/supergoose');
const {
  server,
} = require('../src/server');
const auth = require('../src/middleware/bearer-auth');
const mockRequest = supergoose(server);

it('should fail with missing headers', async () => {
  let req = {
    headers: {
      authorization: '',
    },
  };
  let res = {};
  let next = jest.fn();
  await auth(req, res, next);
  expect(next).toHaveBeenCalledWith('Invalid Login: Missing Headers');
});

it('should fail with bad token', async () => {
  let req = {
    headers: {
      authorization: 'Bearer bad.token',
    },
  };
  let res = {};
  let next = jest.fn();
  await auth(req, res, next);
  expect(next).toHaveBeenCalledWith('Invalid Login');
});

it('should carry on with good token', async () => {
  const results = await mockRequest.post('/signup').send({
    username: 'waleed',
    password: 'waleed',
    role: 'admin',
  });
  let req = {
    headers: {
      authorization: `Bearer ${results.body.token}`,
    },
  };
  let res = {};
  let next = jest.fn();
  await auth(req, res, next);
  expect(next).toHaveBeenCalledWith();
});