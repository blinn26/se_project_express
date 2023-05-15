const HTTP_ERRORS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ALREADY_EXIST: 409,
  INTERNAL_SERVER_ERROR: 500,
  DUPLICATED_KEY_ERROR: 11000,
};

module.exports = {
  HTTP_ERRORS,
};
