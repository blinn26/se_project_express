/* eslint-disable consistent-return */
const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/apiErrors");

const createItem = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      throw new BadRequestError("Missing required fields");
    }

    const item = new ClothingItem({ name, weather, imageUrl, owner: userId });
    await item.save();

    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const getItems = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const items = await ClothingItem.find();

    const itemsWithIsLiked = items.map((item) => {
      const isLiked = item.likes.includes(userId);
      return { ...item.toObject(), isLiked };
    });

    return res.status(200).send({ data: itemsWithIsLiked });
  } catch (error) {
    next(new InternalServerError("Error from getItems"));
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new BadRequestError("Invalid item ID");
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (String(item.owner) !== String(req.user.userId)) {
      throw new ForbiddenError();
    }

    await ClothingItem.deleteOne({ _id: itemId });
    return res.send({ message: "Item deleted" });
  } catch (error) {
    next(error);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new BadRequestError("Invalid item ID");
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const isLiked = item.likes.includes(userId);
    return res.status(200).send({ data: { ...item.toObject(), isLiked } });
  } catch (error) {
    next(new InternalServerError("Error from likeItem"));
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      throw new BadRequestError("Invalid item ID");
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    const isLiked = item.likes.includes(userId);
    return res.status(200).send({ data: { ...item.toObject(), isLiked } });
  } catch (error) {
    next(new InternalServerError("Error from dislikeItem"));
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
