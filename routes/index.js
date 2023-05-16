const router = require("express").Router();
const clothingItem = require("./clothingItem.js");

const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", clothingItem);
router.use("/users", auth, userRouter);

module.exports = router;
