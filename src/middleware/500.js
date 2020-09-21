/**
 * 500 module
 * return status 500
 * return json error message
 */
'use-strict';

module.exports = (err, req, res, next) => {
  res.status(500).json({
    general_msg: 'Something went wrong O_O',
    err: err,
  });
};