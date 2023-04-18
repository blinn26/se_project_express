const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getUser } = require("../controllers/users");
const { getCurrentUser } = require("../controllers/users");
const userController = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.get("/:userId", getUser);

router.patch("/me", userController.updateProfile);

module.exports = router;
