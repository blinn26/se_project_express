const router = require("express").Router();

const { createItem } = require("./controllers/clothingItem");

//CRUD

//CREATE
router.post("/", createItem);

module.exports = router;

//READ
