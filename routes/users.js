const router = require("express").Router();
const auth = require("../middlewares/auth");
const userController = require("../controllers/users");
const {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.get("/", auth, getUsers);
router.get("/:userId", auth, getUser);
router.post("/", createUser);
router.post("/login", login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);
router.patch("/me", userController.updateProfile);

module.exports = router;
