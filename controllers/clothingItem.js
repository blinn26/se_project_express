const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errorConstructors/badRequestError");
const NotFoundError = require("../errorConstructors/notFoundError");

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
      res.status(201).json(savedItem);
    })
    .catch((error) => {
      next(error);
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

      res.status(200).send({ data: itemsWithIsLiked });
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
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      } else if (!item.owner.equals(userId)) {
        res
          .status(403)
          .json({ message: "You do not have permission to delete this item." });
      } else {
        return item.remove();
      }
    })
    .then(() => {
      res.status(204).send();
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
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      } else {
        const isLiked = item.likes.includes(userId);
        res.status(200).send({ data: { ...item.toObject(), isLiked } });
      }
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
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      } else {
        const isLiked = item.likes.includes(userId);
        res.status(200).send({ data: { ...item.toObject(), isLiked } });
      }
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
