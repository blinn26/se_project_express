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
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODES.BAD_REQUEST).send({ message: "Invalid id" });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: "Error from getUser" });
      }
    });
};

async function createUser(req, res) {
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
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(ERROR_CODES.BAD_REQUEST).send({ message: "Invalid data" });
    } else if (err.code === 11000) {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "A user with this email already exists." });
    } else {
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from createUser" });
    }
  }

  return Promise.resolve();
}
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(ERROR_CODES.OK).send({ token });
  } catch (err) {
    res.status(ERROR_CODES.UNAUTHORIZED).send({ message: err.message });
  }
}
module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
