'use strict';

const schema = require('./user-schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class User {
  constructor() {
    this.schema = schema;
  }
  async create(record) {
    // console.log(record);
    try {
      const result = await this.schema.findOne({
        username: record.username,
      });

      if (result === null) {
        const newRecord = new this.schema(record);
        newRecord.password = await bcrypt.hash(newRecord.password, 5);
        console.log('new record:', newRecord);
        return newRecord.save();
      } else {
        return [this.generateToken({ result }), result];
      }
    } catch (err) {
      return err;
    }
  }

  async findAll(username) {
    console.log(username);
    let queryParam = username ? {
      username,
    } : {};
    return await this.schema.find(queryParam);
  }

  async authenticateBasic(username, password) {
    let query = {
      username,
    };

    let user = await this.schema.findOne(query);

    console.log(user);

    if(!user) {
      return null;
    }
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
    console.log(user.username);
    const signed = jwt.sign({
      username: user.username,
      role: user.role,
    }, process.env.SECRET);
    return signed;
  }

  async authenticateToken(token) {
    try {
      let userToken = await jwt.verify(token, process.env.SECRET);

      console.log(userToken);
      let inDb = await this.findAll(userToken.username);

      return inDb ? Promise.resolve(inDb) : Promise.reject();

    } catch (e) {
      return Promise.reject();
    }
  }

}

module.exports = new User();