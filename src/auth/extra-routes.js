'use strict';

const express = require('express');
const router = express.Router();
const bearerMiddleware = require('../middleware/bearer-auth');
const permissions = require('../middleware/authorize');

router.get('/public', routeHandler);
router.get('/private', bearerMiddleware, routeHandler);
router.get('/readonly', bearerMiddleware, permissions('read'), routeHandler);
router.post('/create', bearerMiddleware, permissions('create'), routeHandler);
router.put('/update', bearerMiddleware, permissions('update'), routeHandler);
router.delete('/delete', bearerMiddleware, permissions('delete'), routeHandler);

router.get('/secret', bearerMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

function routeHandler(req, res, next) {
  res.status(200).send(`Route ${req.originalUrl} works`);
}

module.exports = router;
