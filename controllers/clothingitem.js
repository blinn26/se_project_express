const mongoose = require("mongoose");
const ERROR_CODES = require("../utils/errors");
const ClothingItem = require("../models/clothingItem");

const createItem = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "User is missing" });
    }

    const userId = req.user._id;

    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ message: "Missing required fields" });
    }

    const item = new ClothingItem({ name, weather, imageUrl, owner: userId });
    await item.save();

    return res.status(ERROR_CODES.CREATED).json(item);
  } catch (error) {
    console.error(error);
    return res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      return res.status(ERROR_CODES.OK).send({ data: items });
    })
    .catch(() => {
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
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
