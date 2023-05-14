const errorHandler = (err, req, res, _next) => {
  // Log the error and send a generic response to the user.
  console.error(err);
  return res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
