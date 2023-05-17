const router = require("express").Router();
const clothingItem = require("./clothingItem.js");

const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateCardBody } = require("../middlewares/validation");
const { NotFoundError } = require("../errorConstructors/notFoundError.js");

router.post("/signin", validateCardBody, login);
router.post("/signup", validateCardBody, createUser);

router.use("/items", clothingItem);
router.use("/users", auth, userRouter);

// Handling non-existing routes
router.use("*", (req, res, next) => {
  next(new NotFoundError("The requested resource was not found"));
});

module.exports = router;
