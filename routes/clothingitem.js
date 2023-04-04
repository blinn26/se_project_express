const router = require("express").Router();

const { createItem, getItems } = require("../controllers/clothingItem");

//CRUD

//CREATE
router.post("/", createItem);

//READ
router.get("/", getItems);

//UPDATE

//DELETE

module.exports = router;
