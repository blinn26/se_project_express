const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;
const { HTTP_ERRORS } = require("../utils/httpErrors");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errorConstructors/badRequestError");

const NotFoundError = require("../errorConstructors/notFoundError");

const createItem = async (req, res, next) => {
  console.log("createItem called with req.body:", req.body);
  const { userId } = req.user;
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    throw new BadRequestError("Missing required fields");
  }

  const item = new ClothingItem({ name, weather, imageUrl, owner: userId });
  await item.save();

  console.log("createItem successful, item created:", item);

  return res.status(HTTP_ERRORS.CREATED).json(item);
};

const getItems = async (req, res, next) => {
  console.log("getItems called");
  const { userId } = req.user;
  const items = await ClothingItem.find();

  const itemsWithIsLiked = items.map((item) => {
    const isLiked = item.likes.includes(userId);
    return { ...item.toObject(), isLiked };
  });

  console.log("getItems successful, items retrieved:", itemsWithIsLiked);

  return res.status(HTTP_ERRORS.OK).send({ data: itemsWithIsLiked });
};

async function deleteItem(req, res, next) {
  const { userId } = req.user; // define userId here
  const { itemId } = req.params;

  if (!ObjectId.isValid(itemId)) {
    return next(
      new BadRequestError(
        "Invalid path parameter: 'itemId' must be a single String of 12 bytes or a string of 24 hex characters"
      )
    );
  }

  const item = await ClothingItem.findById(itemId);

  if (!item) {
    return next(new NotFoundError("Item not found"));
  }

  // Log both values to check their actual values
  console.log("Owner: ", String(item.owner));
  console.log("User ID: ", String(req.user.userId));

  if (!item.owner.equals(userId)) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this item." });
  }

  await item.remove();

  return res.status(204).send();
}

const likeItem = async (req, res, next) => {
  console.log("likeItem called with req.params:", req.params);
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
  console.log("likeItem successful, item updated:", item);

  return res
    .status(HTTP_ERRORS.OK)
    .send({ data: { ...item.toObject(), isLiked } });
};

const dislikeItem = async (req, res, next) => {
  console.log("dislikeItem called with req.params:", req.params);
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
  console.log("dislikeItem successful, item updated:", item);

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
