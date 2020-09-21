'use strict';

const superagent = require('superagent');
const users = require('../lib/model/user/user-collection');

module.exports = async (req, res, next) => {
  try {
    const code = await req.query.code;

    let token = await getToken(code);

    let dbToken = await getTokenFromDB();

    let oauthUser = await userResponse(token);

    // console.log(oauthUser);


    // let allUsers = await users.findAll();

    // console.log(allUsers);


    // See if the user is already in the database based on username
    users.findAll(oauthUser.login).then( result => {
      if(!result.length) {
        const newUserObj = {
          username: oauthUser.login,
          password: 'password',
          fullname: oauthUser.name,
        };
        // Add user to db
        //   let user = new users(newUserObj);
        users.create(newUserObj).then( user => {
          req.user = user;
          next();    
        });
        // Make a token
        // console.log(saved);
        // // let signed = await users.generateToken();
      
        // //   req.token = signed;
      } else {
        // Make a token for req obj for user already in db
        // console.log('heeeere');
        // console.log(result[0]);
        req.token = dbToken;
        req.user = result[0];
        next();
    
      }
    }).catch (e => {
      next(e);
    });
    
    
  } catch (e) {
    next('Oauth Failed');
  }
};

async function getTokenFromDB() {
  return await users.generateToken();
}

async function getToken(code) {
  let tokenRetrieval = await superagent.post('https://github.com/login/oauth/access_token')
    .send({
      code: code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: 'http://localhost:3000/oauth',
      grant_type: 'authorization_code',
    });
  console.log(tokenRetrieval.body);
  return await tokenRetrieval.body.access_token;
}

async function userResponse(token) {
  let userRetrieval = await superagent.get('https://api.github.com/user')
    .set('user-agent', 'express-app')
    .set('Authorization',`token ${token}`);
  let user = userRetrieval.body;
  return user;
}