const User = require("../models/users");

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "Error from getUsers", err });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        res.status(404).send({ message: "User not found" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      res.status(500).send({ message: "Error from getUser", err });
    });
};

function createUser(req, res) {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Error from createUser", err });
      }
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
