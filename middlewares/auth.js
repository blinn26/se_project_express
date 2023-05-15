const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { HTTP_ERRORS } = require("../utils/httpErrors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(HTTP_ERRORS.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return res
      .status(HTTP_ERRORS.UNAUTHORIZED)
      .send({ message: "Invalid token" });
  }

  req.user = payload;
  return next();
};

module.exports = auth;
