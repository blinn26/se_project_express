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
    next(new BadRequestError("Missing required fields"));
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
  const { userId } = req.user;

  ClothingItem.find()
    .then((items) => {
      const itemsWithIsLiked = items.map((item) => {
        const isLiked = item.likes.includes(userId);
        return { ...item.toObject(), isLiked };
      });

      res.status(HTTP_ERRORS.OK).send({ data: itemsWithIsLiked });
    })
    .catch((error) => {
      next(error);
    });
};

const deleteItem = (req, res, next) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  if (!ObjectId.isValid(itemId)) {
    next(
      new BadRequestError(
        "Invalid path parameter: 'itemId' must be a single String of 12 bytes or a string of 24 hex characters"
      )
    );
    return;
  }

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (!item.owner.equals(userId)) {
        next(
          new ForbiddenError("You do not have permission to delete this item.")
        );
        return;
      }
      return item.remove();
    })
    .then(() => {
      res.status(HTTP_ERRORS.OK).send();
    })
    .catch((error) => {
      next(error);
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
