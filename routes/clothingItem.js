const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const auth = require("../middlewares/auth");
const { validateId, validateCardBody } = require("../middlewares/validation");

// CRUD METHODS

// CREATE
router.post("/", auth, validateCardBody, createItem);

// READ
router.get("/", auth, getItems);

// DELETE
router.delete("/:itemId", auth, validateId, deleteItem);

// LIKE
router.put("/:itemId/likes", auth, validateId, likeItem);

// DISLIKE
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
