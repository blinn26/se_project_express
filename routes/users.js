const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/", auth, getUsers);
/* router.get("/_id", auth, getUser);
router.post("/", createUser);  */
router.post("/login", auth, login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUser);

module.exports = router;
