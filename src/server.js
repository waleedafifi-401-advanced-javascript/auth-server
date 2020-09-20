'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const notFound = require('./middleware/404.js');
const errorServer = require('./middleware/500.js');

const router = require('./auth/route');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

app.use(router);

app.get('/bad', (req, res, next) => {
  res.status(500).json('Error!!');
});

app.use('*', notFound);
app.use(errorServer);

module.exports = {
  server: app,
  start: (port = process.env.PORT || 3000) => {
    app.listen(port, () => console.log(`Listening port ${port}`));
  },
};