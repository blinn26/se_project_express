const ERROR_CODES = require("../utils/errors");

// Handle a database error
function handleDatabaseError(err, res) {
  console.error(err);
  res
    .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
    .json({ error: "An unexpected error occurred" });
}

// Handle a not found error
function handleNotFoundError(res) {
  res.status(ERROR_CODES.NOT_FOUND).json({ error: "Resource not found" });
}
