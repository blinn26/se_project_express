const mongoose = require("mongoose");
const ERROR_CODES = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");

const createItem = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const item = new ClothingItem({ name, avatar });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.status(ERROR_CODES.OK).send({ data: items });
    })
    .catch(() => {
      res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Error from getItems" });
    });
};
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid item ID" });
    }
    const item = await ClothingItem.findById(itemId);
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Item not found" });
    }
    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(ERROR_CODES.OK).send({ message: "Item deleted" });
  } catch (error) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from deleteItem" });
  }
};

const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Item not found" });
    }

    return res.status(ERROR_CODES.OK).send({ data: item });
  } catch (error) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from likeItem" });
  }
};
const dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );
    if (!item) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Item not found" });
    }

    return res.status(ERROR_CODES.OK).send({ data: item });
  } catch (error) {
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from dislikeItem" });
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
