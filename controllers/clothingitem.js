const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  const item = new ClothingItem({ name, weather, imageURL });
  item
    .validate()
    .then(() => {
      return item.save();
    })
    .then((savedItem) => {
      res.status(200).send({ data: savedItem });
    })
    .catch((err) => {
      res.status(400).send({ message: "Error from ClothingItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from getItems", err });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } }, { new: true })
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(200).send({ data: item });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from updateItem", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        res.status(404).send({ message: "Item not found" });
      } else {
        res.status(204).send({});
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from deleteItem", err });
    });
};

const likeItem = (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.user ? req.user._id : null;

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
    (err, item) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      res.send(item);
    }
  );
};

const dislikeItem = (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.user ? req.user._id : null;

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
    (err, item) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      res.send(item);
    }
  );
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
