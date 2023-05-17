const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { HTTP_ERRORS } = require("../utils/httpErrors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const err = new Error("Authorization required");
    err.status = HTTP_ERRORS.UNAUTHORIZED;
    return next(err);
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    const tokenError = new Error("Invalid token");
    tokenError.status = HTTP_ERRORS.UNAUTHORIZED;
    return next(tokenError);
  }

  req.user = payload;
  return next();
};

module.exports = auth;
