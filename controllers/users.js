const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(ERROR_CODES.OK).send({ data: users });
    })
    .catch(() => {
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getUsers" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODES.NOT_FOUND).send({ message: "User not found" });
      } else {
        res.status(ERROR_CODES.OK).send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(ERROR_CODES.BAD_REQUEST).send({ message: "Invalid id" });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: "Error from getUser" });
      }
    });
};

const createUser = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "A user with this email already exists." });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    return res.status(ERROR_CODES.OK).send({ data: user });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid data" });
    }
    if (error.code === 11000) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "A user with this email already exists." });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from createUser" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    return res.status(ERROR_CODES.OK).json({ token });
  } catch (error) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "User not found" });
    }

    return res.status(ERROR_CODES.OK).send({ data: user });
  } catch (err) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid updates!" });
    }

    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "User not found" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save({ validateBeforeSave: true });

    return res.send({ data: user });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: error.message });
    }
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
};

module.exports = {
  getCurrentUser,
  getUsers,
  getUser,
  createUser,
  login,
  updateProfile,
};
