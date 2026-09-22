const ApiError = require('../utils/ApiError');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new ApiError(400, 'Validation failed', result.error.flatten().fieldErrors));
    }
    req[source] = result.data;
    return next();
  };
}

module.exports = validate;
