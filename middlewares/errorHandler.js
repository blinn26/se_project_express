const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;

// re writing the error handler this way takes care of the 500 response to everything and makes sure the other errors loggers, and http status codes can be utilized.
