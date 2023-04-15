const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getUsers,
  login,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);
router.get("/", auth, getUsers);
router.post("/login", login);

module.exports = router;
