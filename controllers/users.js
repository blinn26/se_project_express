const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errorConstructors/badRequestError");
const UnauthorizedError = require("../errorConstructors/unauthorizedError");
const NotFoundError = require("../errorConstructors/notFoundError");
const ConflictError = require("../errorConstructors/conflictError");

const createUser = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("A user with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const userObject = user.toObject();
    delete userObject.password;
    res.status(201).send(userObject);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7 days",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).send({ data: user });
  } catch (error) {
    next(error);
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
      throw new BadRequestError("Invalid updates!");
    }

    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save({ validateBeforeSave: true });

    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
