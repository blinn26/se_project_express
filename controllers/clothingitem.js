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

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } }, { new: true })
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send({ data: item });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(204).send({});
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from deleteItem", err });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
