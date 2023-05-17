const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/users");
const userController = require("../controllers/users");
const { validateCardBody } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);

router.patch("/me", validateCardBody, userController.updateProfile);

module.exports = router;
