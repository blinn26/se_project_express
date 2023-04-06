const router = require("express").Router();
const clothingitem = require("./clothingitem");

router.use("/items", clothingitem);

router.use((req, res) => {
  res.status(500).send({ message: "Router Not found" });
});

module.exports = router;
