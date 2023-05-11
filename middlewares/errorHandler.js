const ERROR_CODES = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
    message: "Something broke!",
  });
  next();
};

module.exports = errorHandler;
