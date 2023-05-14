const router = require("express").Router();
const clothingItem = require("./clothingItem.js");

const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const ERROR_CODES = require("../utils/apiErrors.js");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", clothingItem);
router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Router Not found" });
});

module.exports = router;
