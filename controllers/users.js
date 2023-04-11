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
    .catch((error) => {
      console.error(error);
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
      console.error(error);
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

    res.status(ERROR_CODES.OK).send({ data: user });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(ERROR_CODES.BAD_REQUEST).send({ message: "Invalid data" });
    } else if (error.code === 11000) {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "A user with this email already exists." });
    } else {
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createUser" });
    }
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

    res.status(ERROR_CODES.OK).json({ token });
  } catch (error) {
    console.error(error);
    res
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

    res.status(ERROR_CODES.OK).send({ data: user });
  } catch (err) {
    console.error(err);
    res
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
};
