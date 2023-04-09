const ClothingItem = require("../models/clothingitem");
const mongoose = require("mongoose");

const User = require("../models/users");

const createItem = (req, res) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  const item = new ClothingItem({ name, weather, imageUrl, owner });

  item
    .validate()
    .then(() => {
      return item.save();
    })
    .then((savedItem) => {
      res.status(200).send({ data: savedItem });
    })
    .catch((err) => {
      res.status(400).send({ message: "Error from ClothingItem", err });
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
  const { imageUrl } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
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
  const itemId = req.params.itemId;
  console.log(itemId);
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).send({ message: "Invalid item ID" });
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from deleteItem", err });
    });
};

const likeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.status(200).send({ data: item });
  } catch (error) {
    res.status(500).send({ message: "Error from likeItem", error });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.status(200).send({ data: item });
  } catch (error) {
    res.status(500).send({ message: "Error from dislikeItem", error });
  }
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
