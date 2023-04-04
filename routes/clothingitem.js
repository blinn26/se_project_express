const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
} = require("../controllers/clothingItem");

//CRUD

//CREATE
router.post("/", createItem);

//READ
router.get("/", getItems);

//UPDATE
router.put("/:itemId", updateItem);
//DELETE

module.exports = router;
