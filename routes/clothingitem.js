const router = require("express").Router();

const { createItem } = require("../controllers/clothingitem");

//CRUD

//CREATE
router.post("/", createItem);

module.exports = router;

//READ
