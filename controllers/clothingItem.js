const mongoose = require("mongoose");
const ERROR_CODES = require("../utils/apiErrors");
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
    console.log(req.user, { userId });
    const { name, weather, imageUrl } = req.body;

    if (!name || !weather || !imageUrl) {
      next(new BadRequestError("Missing required fields"));
      return;
    }

    const item = new ClothingItem({ name, weather, imageUrl, owner: userId });
    await item.save();

    res.status(ERROR_CODES.CREATED).json(item);
  } catch (error) {
    if (error.name === "ValidationError") {
      next(new BadRequestError("Validation error"));
    } else {
      next(new InternalServerError("Server error"));
    }
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

    res.status(ERROR_CODES.OK).json({ data: itemsWithIsLiked });
  } catch (error) {
    next(new InternalServerError("Error from getItems"));
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      next(new BadRequestError("Invalid item ID"));
      return;
    }

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      next(new NotFoundError("Item not found"));
      return;
    }

    if (String(item.owner) !== String(req.user.userId)) {
      next(new ForbiddenError());
      return;
    }

    await ClothingItem.deleteOne({ _id: itemId });
    res.json({ message: "Item deleted" });
  } catch (error) {
    next(new InternalServerError("Error from deleteItem"));
  }
};

const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      next(new BadRequestError("Invalid item ID"));
      return;
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!item) {
      next(new NotFoundError("Item not found"));
      return;
    }

    const isLiked = item.likes.includes(userId);
    res.status(ERROR_CODES.OK).json({ data: { ...item.toObject(), isLiked } });
  } catch (error) {
    next(new InternalServerError("Error from likeItem"));
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      next(new BadRequestError("Invalid item ID"));
      return;
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!item) {
      next(new NotFoundError("Item not found"));
      return;
    }

    const isLiked = item.likes.includes(userId);
    res.status(ERROR_CODES.OK).json({ data: { ...item.toObject(), isLiked } });
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
