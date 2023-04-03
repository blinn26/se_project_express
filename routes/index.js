const router = require("express").Router();
const itemRouter = require("./itemRouter");

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(500).send({ message: "Router Not found" });
});
