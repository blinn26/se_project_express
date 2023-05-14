const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../config");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED, NOT_FOUND } =
  require("../utils/apiErrors").ERROR_CODES;

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });
    return res.status(201).send({ data: user });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      return next(new Error(BAD_REQUEST));
    }
    return next(new Error(INTERNAL_SERVER_ERROR));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new Error(UNAUTHORIZED));
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7 days",
    });
    return res.status(200).json({ token });
  } catch (error) {
    return next(new Error(INTERNAL_SERVER_ERROR));
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return next(new Error(NOT_FOUND));
    }
    return res.status(200).send({ data: user });
  } catch (error) {
    if (error.name === "CastError") {
      return next(new Error(BAD_REQUEST));
    }
    return next(new Error(INTERNAL_SERVER_ERROR));
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    if (!isValidOperation) {
      return next(new Error(BAD_REQUEST));
    }
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return next(new Error(NOT_FOUND));
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save({ validateBeforeSave: true });
    return res.send({ data: user });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new Error(BAD_REQUEST));
    }
    return next(new Error(INTERNAL_SERVER_ERROR));
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
