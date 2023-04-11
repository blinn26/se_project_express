const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET: MY_APP_SECRET_KEY } = require("../utils/config");

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
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ message: "User not found" });
    }

    const passwordMatches =
      password && (await bcrypt.compare(password, user.password));

    if (!passwordMatches) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(ERROR_CODES.OK).json({ token });
  } catch (err) {
    console.error(err);
    res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

module.exports = {
  login,
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
