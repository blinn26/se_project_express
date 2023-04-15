const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitem");

// CRUD METHODS

// CREATE
router.post("/", auth, createItem);

// READ
router.get("/", auth, getItems);

// DELETE
router.delete("/:itemId", auth, deleteItem);

// LIKE
router.put("/:itemId/likes", auth, likeItem);

// DISLIKE
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
