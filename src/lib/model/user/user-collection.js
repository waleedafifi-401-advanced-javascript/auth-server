'use strict';

const schema = require('./user-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const MINUTES = 15;

class User {
  constructor() {
    this.schema = schema;
  }

  async create(record) {
    console.log(record);
    try {
      const result = await this.schema.findOne({
        username: record.username,
      });

      if (result === null) {
        const newRecord = new this.schema(record);
        newRecord.password = await bcrypt.hash(newRecord.password, 5);
        console.log('new record:', newRecord);

        // if (newRecord.role) {
        const roleMap = {
          user: 1,
          writer: 2,
          editor: 3,
          admin: 4,
        };
        const capabilities = ['read', 'create', 'update', 'delete'];
        const allowedForThisUser = [];
        for (let i = 0; i < roleMap[newRecord.role]; i++) {
          allowedForThisUser.push(capabilities[i]);
        }
        newRecord.capabilities = allowedForThisUser;
        // }s

        return newRecord.save();
      } else {
        let token = this.generateToken(result);
        return {
          token,
          result,
        };
      }
    } catch (err) {
      return err;
    }
  }

  async findAll(username) {
    let queryParam = username ? {
      username,
    } : {};
    console.log(queryParam);
    return await this.schema.find(queryParam);
  }

  async authenticateBasic(username, password) {
    let query = {
      username,
    };

    let user = await this.schema.findOne(query);

    if (!user) {
      return null;
    }

    console.log(user);

    let compare = await this.comparePasswords(user, password);

    console.log(compare);

    if (user && compare) {
      let signed = await this.generateToken(user);
      return {
        token: signed,
        user: user,
      };
    } else {
      return Promise.reject();
    }
  }

  async comparePasswords(user, password) {
    console.log(password);
    console.log(user.password);
    let valid = await bcrypt.compare(password, user.password);
    return valid ? this : Promise.reject();
  }

  generateToken(user) {
    const signed = jwt.sign({
      id: user._id,
      username: user.username,
      role: user.role,
      capabilities: user.capabilities,
      expiresIn: 900000,
    }, process.env.SECRET);
    return signed;
  }

  async authenticateToken(token) {
    console.log(token);

    try {
      let tokenObject = jwt.verify(token, process.env.SECRET);

      if (Date.now() / 1000 - tokenObject.iat > 60 * MINUTES) {
        return Promise.reject('Token expired');
      }

      if (tokenObject.username) {
        let inDb = await this.findAll(tokenObject.username);
        return inDb ? Promise.resolve(inDb[0]) : Promise.reject();
      } else {
        return Promise.reject();
      }

    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  }
}
module.exports = new User();