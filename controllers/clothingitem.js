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

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(204).send({}))
    .catch((err) => {
      res.status(500).send({ message: "Error from deleteItem", err });
    });
};

// clothingItem.controller.js

const ERROR_CODES = require("../utils/errors");

module.exports.createClothingItem = async (req, res, next) => {
  try {
    // ... code to create clothing item ...
    res.status(201).json(clothingItem);
  } catch (err) {
    err.statusCode = ERROR_CODES.BAD_REQUEST;
    next(err);
  }
};

module.exports.getClothingItem = async (req, res, next) => {
  try {
    // ... code to get clothing item ...
    res.json(clothingItem);
  } catch (err) {
    err.statusCode = ERROR_CODES.NOT_FOUND;
    next(err);
  }
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
