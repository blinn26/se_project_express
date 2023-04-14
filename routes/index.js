const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users"); // Add this line
const auth = require("../middlewares/auth"); // Add this line to import the auth middleware
const ERROR_CODES = require("../utils/errors"); // Import the ERROR_CODES

router.use("/items", auth, clothingItem);
router.use("/users", userRouter); // Remove auth here
// Add these two lines for the signin and signup routes
router.post("/signin", login);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Router Not found" }); // Use the NOT_FOUND constant here
});

module.exports = router;
