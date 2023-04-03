const ClothingItem = require("./models/clothingitem");

const createItem = (req, res) => {
  console.log(req.body);
  console.log(req);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then(({ item }) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from createItem", err });
    });
};
