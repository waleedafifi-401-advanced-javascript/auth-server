/**
 * Dear Programmer:
 * 
 * When I wrote this code, only God and I know how it worked.
 * Now, only God knows it!
 * 
 * Therefore, if you are trying to optimize this routine and
 * it fails (most surely), please increase this countre
 * as a warning for the next person:
 * 
 * total_hours_wasted_here: 2
 * 
 */

'use strict';

const server = require('./src/server');
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URL;

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, mongooseOptions);

server.start();