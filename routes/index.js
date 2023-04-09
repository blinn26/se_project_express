const router = require("express").Router();
const clothingitem = require("./clothingitem");
const userRouter = require("./users");

router.use("/items", clothingitem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(404).send({ message: "Router Not found" });
});

module.exports = router;
