'use strict';

const mongoose = require('mongoose');

const users = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  fullname: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'writer', 'editor', 'user'],
  },
});

module.exports = mongoose.model('users', users);