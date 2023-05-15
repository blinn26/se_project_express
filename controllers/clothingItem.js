const mongoose = require("mongoose");
const { HTTP_ERRORS } = require("../utils/httpErrors");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errorConstructors/badRequestError");
const ForbiddenError = require("../errorConstructors/forbiddenError");
const NotFoundError = require("../errorConstructors/notFoundError");

const createItem = async (req, res, next) => {
  const { userId } = req.user;
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    throw new BadRequestError("Missing required fields");
  }

  const item = new ClothingItem({ name, weather, imageUrl, owner: userId });
  await item.save();

  return res.status(HTTP_ERRORS.CREATED).json(item);
};

const getItems = async (req, res, next) => {
  const { userId } = req.user;
  const items = await ClothingItem.find();

  const itemsWithIsLiked = items.map((item) => {
    const isLiked = item.likes.includes(userId);
    return { ...item.toObject(), isLiked };
  });

  return res.status(HTTP_ERRORS.OK).send({ data: itemsWithIsLiked });
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new BadRequestError("Invalid item ID");
  }

  const item = await ClothingItem.findById(itemId);

  if (!item) {
    throw new NotFoundError("Item not found");
  }

  if (String(item.owner) !== String(req.user.userId)) {
    throw new ForbiddenError("Forbidden");
  }

  await ClothingItem.deleteOne({ _id: itemId });
  return res.send({ message: "Item deleted" });
};
const likeItem = async (req, res, next) => {
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
  return res
    .status(HTTP_ERRORS.OK)
    .send({ data: { ...item.toObject(), isLiked } });
};

const dislikeItem = async (req, res, next) => {
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
  return res
    .status(HTTP_ERRORS.OK)
    .send({ data: { ...item.toObject(), isLiked } });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
