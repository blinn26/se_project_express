const mongoose = require("mongoose");
const { HTTP_ERRORS } = require("../utils/httpErrors");
const ClothingItem = require("../models/clothingItem");

const createItem = async (req, res) => {
  try {
    const { userId } = req.user;

    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .json({ message: "Missing required fields" });
    }

    const item = new ClothingItem({ name, weather, imageUrl, owner: userId });
    await item.save();

    return res.status(HTTP_ERRORS.CREATED).json(item);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .json({ message: "Validation error" });
    }
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error" });
  }
};

const getItems = async (req, res) => {
  try {
    const { userId } = req.user;

    const items = await ClothingItem.find();

    const itemsWithIsLiked = items.map((item) => {
      const isLiked = item.likes.includes(userId);
      return { ...item.toObject(), isLiked };
    });

    return res.status(HTTP_ERRORS.OK).send({ data: itemsWithIsLiked });
  } catch (error) {
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from getItems" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res
        .status(HTTP_ERRORS.NOT_FOUND)
        .send({ message: "Item not found" });
    }

    if (String(item.owner) !== String(req.user.userId)) {
      return res.status(HTTP_ERRORS.FORBIDDEN).send({ message: "Forbidden" });
    }

    await ClothingItem.deleteOne({ _id: itemId });
    return res.send({ message: "Item deleted" });
  } catch (error) {
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from deleteItem" });
  }
};
const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!item) {
      return res
        .status(HTTP_ERRORS.NOT_FOUND)
        .send({ message: "Item not found" });
    }

    const isLiked = item.likes.includes(userId);
    return res
      .status(HTTP_ERRORS.OK)
      .send({ data: { ...item.toObject(), isLiked } });
  } catch (error) {
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from likeItem" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .send({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!item) {
      return res
        .status(HTTP_ERRORS.NOT_FOUND)
        .send({ message: "Item not found" });
    }

    const isLiked = item.likes.includes(userId);
    return res
      .status(HTTP_ERRORS.OK)
      .send({ data: { ...item.toObject(), isLiked } });
  } catch (error) {
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
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
