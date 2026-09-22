const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token is required'));
  }

  try {
    const token = authorization.slice(7);
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired authentication token'));
  }
}

module.exports = { authenticate };
