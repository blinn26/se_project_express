const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from ClothingItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from getItems", err });
    });
};

module.exports = {
  createItem,
  getItems,
};
