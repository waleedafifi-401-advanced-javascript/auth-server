'use strict';

const base64 = require('base-64');
const users = require('../lib/model/user/user-collection');

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Something went wrong! Please check tour username and password');
  }

  console.log(req.headers.authorization);
  let userNameAndPassword = await req.headers.authorization
    .split(' ')
    .pop();

  console.log(userNameAndPassword);

  let [username, password] = await base64
    .decode(userNameAndPassword)
    .split(':');

  console.log(username, password);

  try {
    let {
      token,
      user,
    } = await users.authenticateBasic(username, password);
    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    next('Invalid login credentials');
  }
};

module.exports = auth;