const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

//CRUD METHODS

//CREATE
router.post("/", createItem);

//READ
router.get("/", getItems);

//UPDATE
router.put("/:itemId", updateItem);

//DELETE
router.delete("/:itemId", deleteItem);

//LIKE
router.put("/:itemId/likes", likeItem);

//DISLIKE
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
