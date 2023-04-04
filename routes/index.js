const router = require("express").Router();
const clothingItemRouter = require("./clothingItem");
const userRouter = require("./user");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
