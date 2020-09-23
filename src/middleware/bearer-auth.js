'use strict';

const User = require('../lib/model/user/user-collection');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
  }

  let token = req.headers.authorization.split(' ').pop();

  try {
    const users = await User.authenticateToken(token);
    console.log(users);
    req.user = {
      username: users.username,
      role: users.role,
      capabilities: users.capabilities,
    };
    next();
  } catch (e) {
    next('Invalid Login');
  }
};
