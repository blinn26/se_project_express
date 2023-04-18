const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/users");
const userController = require("../controllers/users");

router.get("/me", auth, getCurrentUser);

router.patch("/me", userController.updateProfile);

module.exports = router;
