const errorHandler = (err, req, res, next) => {
  res.status(500).send({
    status: "error",
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
