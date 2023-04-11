const router = require("express").Router();
const clothingitem = require("./clothingItem");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users"); // Add this line

router.use("/items", clothingitem);
router.use("/users", userRouter);

// Add these two lines for the signin and signup routes
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(404).send({ message: "Router Not found" });
});

module.exports = router;
