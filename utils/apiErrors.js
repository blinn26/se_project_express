const ERROR_CODES = {
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

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends ApiError {
  constructor(message) {
    super(ERROR_CODES.BAD_REQUEST, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message) {
    super(ERROR_CODES.UNAUTHORIZED, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message) {
    super(ERROR_CODES.FORBIDDEN, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message) {
    super(ERROR_CODES.NOT_FOUND, message);
  }
}

class ConflictError extends ApiError {
  constructor(message) {
    super(ERROR_CODES.ALREADY_EXIST, message);
  }
}

class InternalServerError extends ApiError {
  constructor(message) {
    super(ERROR_CODES.INTERNAL_SERVER_ERROR, message);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ERROR_CODES,
};
