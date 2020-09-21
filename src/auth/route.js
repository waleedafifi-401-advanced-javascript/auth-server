'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/middleware');
// const schema = require('../lib/model/user/user-schema');
const users = require('../lib/model/user/user-collection');

router.post('/signup', async (req, res, next) => {
  try {
    users.create(req.body).then( result => {
      res.status(201).send(`Created user: ${result}`);
    });
  } catch (e) {
    res.status(403).send('Error creating user');
  }
});

router.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.status(200).json({token: req.token, user: req.user});
});

router.get('/users', async (req,res) => {
  users.findAll().then(result => {
    res.status(200).json(result);
  });
});

module.exports = router;