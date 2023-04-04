const router = require("express").Router();
const clothingItem = require("./clothingItem");
const user = require("./user.js"); // Import user routes
// Import user routes

router.use("/items", clothingItem);
router.use("/users", user); // Add user routes

router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
