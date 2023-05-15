const router = require("express").Router();
const clothingItem = require("./clothingItem.js");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const ERROR_CODES = require("../utils/apiErrors.js");
const { validateUser, validateAuth } = require("../middlewares/validation");

router.post("/signin", validateAuth, login);
router.post("/signup", validateUser, createUser);

router.use("/items", clothingItem);
router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Router Not found" });
});

module.exports = router;
