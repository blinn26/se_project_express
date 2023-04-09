const ClothingItem = require("../models/clothingitem");
const mongoose = require("mongoose");

const User = require("../models/users");
const ERROR_CODES = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  const item = new ClothingItem({ name, weather, imageUrl, owner });

  item
    .validate()
    .then(() => {
      return item.save();
    })
    .then((savedItem) => {
      res.status(ERROR_CODES.OK).send({ data: savedItem });
    })
    .catch((err) => {
      console.error(err);
      res.status(ERROR_CODES.BAD_REQUEST).send({ message: "Invalid Input" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.status(ERROR_CODES.OK).send({ data: items });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from getItems" });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } }, { new: true })
    .then((item) => {
      if (!item) {
        res.status(ERROR_CODES.NOT_FOUND).send({ message: "Item not found" });
      } else {
        res.status(ERROR_CODES.OK).send({ data: item });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from updateItem" });
    });
};

const deleteItem = (req, res) => {
  const itemId = req.params.itemId;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid item ID" });
  }
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.status(ERROR_CODES.OK).end();
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: "Error from deleteItem" });
    });
};

const likeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
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

    res.status(ERROR_CODES.OK).send({ data: item });
  } catch (error) {
    console.error(error);
    res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from likeItem" });
  }
};
const dislikeItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
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

    res.status(ERROR_CODES.OK).send({ data: item });
  } catch (error) {
    console.error(error);
    res
      .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
      .send({ message: "Error from dislikeItem" });
  }
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
