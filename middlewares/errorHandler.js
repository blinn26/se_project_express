const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal Server Error",
  });

  next();
};

module.exports = errorHandler;
