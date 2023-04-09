const User = require("../models/users");
const ERROR_CODES = require("../utils/errors");

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      console.error(err);
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
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(ERROR_CODES.BAD_REQUEST).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: "Error from getUser" });
      }
    });
};

function createUser(req, res) {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(ERROR_CODES.BAD_REQUEST).send({ message: err.message });
      } else {
        res
          .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: "Error from createUser" });
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
