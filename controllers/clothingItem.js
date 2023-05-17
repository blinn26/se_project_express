const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;
const ClothingItem = require("../models/clothingItem");
const { HTTP_ERRORS } = require("../utils/httpErrors");
const BadRequestError = require("../errorConstructors/badRequestError");
const NotFoundError = require("../errorConstructors/notFoundError");
const ForbiddenError = require("../errorConstructors/forbiddenError");

const createItem = (req, res, next) => {
  const { userId } = req.user;
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    next(new BadRequestError("Missing the required fields"));
    return;
  }

  const item = new ClothingItem({ name, weather, imageUrl, owner: userId });

  item
    .save()
    .then((savedItem) => {
      res.status(HTTP_ERRORS.CREATED).json(savedItem);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(error);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find()
    .then((items) => {
      res.status(HTTP_ERRORS.OK).send({ data: items });
    })
    .catch((error) => {
      next(error);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Clothing item cannot be found with this ID"));
        return null; // Return null instead of undefined
      }
      if (!item?.owner?.equals(userId)) {
        next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
        return null; // Return null instead of undefined
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => {
      if (!deletedItem) return; // Do nothing if deletedItem is null
      res
        .status(HTTP_ERRORS.OK)
        .send({ message: "Item Deleted", data: deletedItem });
    })
    .catch((error) => {
      next(new NotFoundError(`Not Found Error: ${error.message}`));
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      const isLiked = item.likes.includes(userId);
      res
        .status(HTTP_ERRORS.OK)
        .send({ data: { ...item.toObject(), isLiked } });
    })
    .catch((error) => {
      next(error);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const { userId } = req.user;

  if (!ObjectId.isValid(itemId)) {
    next(new BadRequestError("Invalid item ID"));
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      const isLiked = item.likes.includes(userId);
      res
        .status(HTTP_ERRORS.OK)
        .send({ data: { ...item.toObject(), isLiked } });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
