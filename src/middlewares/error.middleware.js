const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || (error.code === 11000 ? 409 : 500);
  const message = error.code === 11000 ? 'A record with that unique value already exists' : error.message || 'Internal server error';
  if (statusCode >= 500) console.error(error);
  return res.status(statusCode).json({
    success: false,
    message,
    error: error.error || (statusCode >= 500 ? 'Internal server error' : null),
  });
}

module.exports = { notFound, errorHandler };
