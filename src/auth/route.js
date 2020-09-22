'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/middleware');
const oauth = require('../middleware/oauth');
const users = require('../lib/model/user/user-collection');

router.post('/signup', async (req, res, next) => {
  try {
    users.create(req.body).then( result => {
      let token = users.generateToken(result);
      res.body = {result, token};
      res.status(201).send({token, result});
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

router.get('/', (req, res) => {
  let URL = 'https://github.com/login/oauth/authorize?';
  let options = {
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:3000/oauth',
    scope: 'read:user',
    state: '401appconsent',
  };
  let encoded;
  for (let key in options) {
    encoded = encodeURIComponent(options[key]);
    console.log(encoded);
    URL += `${key}=${encoded}&`;
  }
  // URL.split('').pop().join();
  console.log(URL);

  res.send(`<a href=${URL}>Login</a>`);
});

router.get('/oauth', oauth, async (req, res) => {
  res.status(200).json({ token: req.token, user: req.user });
});

module.exports = router;