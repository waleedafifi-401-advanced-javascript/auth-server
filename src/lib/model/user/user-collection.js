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
        return this.generateToken({
          result,
        });
      }
    } catch (err) {
      return err;
    }
  }

  async findAll() {
    return await this.schema.find({});
  }

  async authenticateBasic(username, password) {
    let query = {
      username,
    };

    let user = await this.schema.findOne(query);

    console.log(user);

    let compare = await this.comparePasswords(user, password);

    console.log(compare);

    if (user && compare) {
      let signed = await this.generateToken();
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

  generateToken() {
    const signed = jwt.sign({
      id: this._id,
    }, process.env.SECRET);
    return signed;
  }
}

module.exports = new User();