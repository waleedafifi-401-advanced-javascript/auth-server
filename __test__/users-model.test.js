'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const User = require('../src/lib/model/user/user-collection');

afterEach(async () => {
  await User.schema.deleteMany({});
});

const fakeUser = {
  username: 'waleed',
  password: 'waleed',
  role: 'admin',
  email: 'waleed@afifi.com',
};

it('should save hashed password', async () => {
  const user = await User.create(fakeUser);
  expect(user.username).toBe(fakeUser.username);
  console.log('userBody', user);
  expect(user.password).not.toBe(fakeUser.password);
});

it('should authenticate known user', async () => {
    await User.create(fakeUser);
  const authenticatedUser = await User.authenticateBasic(fakeUser.username, fakeUser.password );
  expect(authenticatedUser).toBeDefined();
});

it('should get null for unknown user when none', async () => {
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown' );
  expect(authenticatedUser).toBeNull();
});

it('should return user when password good', async () => {
  const user = await User.create(fakeUser);
  const comparedUser = await User.comparePasswords(user, fakeUser.password);
  console.log('comparedUser: ', comparedUser);
  expect(comparedUser).toBeTruthy();
});

it('should generate a token', async () => {
  const user = await User.create(fakeUser);
  const token = await User.generateToken(user);
  expect(token).toBeDefined();
  const verifiedToken = jwt.verify(token, process.env.SECRET);
  expect(verifiedToken.role).toBe(user.role);
});

it('creating an existing user returns user', async () => {

  const user = await User.create(fakeUser);

  const foundOrCreated = await User.create(user);  
  
  expect(foundOrCreated[1].username).toBe(user.username);
  expect(foundOrCreated[1].password).toBe(user.password);

});

