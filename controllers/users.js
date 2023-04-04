const User = require("../models/user");

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from getUsers", err });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from getUser", err });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from createUser", err });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
