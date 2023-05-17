const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const UnauthorizedError = require("../errorConstructors/unauthorizedError");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
