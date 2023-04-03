const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  console.log(req.body);
  console.log(req);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then(({ item }) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from createItem", err });
    });
};
module.exports = {
  createItem,
};
