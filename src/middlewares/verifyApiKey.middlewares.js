const boom = require('@hapi/boom');
const { apiKey } = require('../config');
function verifyApiKey(req, res, next) {
  const clientApiKey = req.headers['api-key'];
  if (clientApiKey === apiKey) {
    next();
  } else {
    next(boom.unauthorized('Wrong Api key'));
  }
}

module.exports = { verifyApiKey };
