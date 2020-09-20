/**
 * 404 module
 * return status 404
 * return json error 404 pagee not found
 */
'use-strict';

module.exports = (req, res, next) => {
  res.status(404).json({ err: '404! page not found' });
};