'use strict';

require('dotenv').config();

const {
  server,
} = require('../src/server');

const supergoose = require('@code-fellows/supergoose');

const mockRequest = supergoose(server);

it('should allow entry with good token', async () => {
  const userData = {
    username: 'waleed111',
    password: '1234',
  };
  const results = await mockRequest.post('/signup').send(userData);
  const response = await mockRequest.get('/secret').auth(results.body.token, {
    type: 'bearer',
  });
  expect(response.status).toBe(200);
});

it('should NOT allow entry with bad token', async () => {
  const response = await mockRequest.get('/secret').auth('bad token', {
    type: 'bearer',
  });
  expect(response.status).toBe(500);
});