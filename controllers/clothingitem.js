const express = require("express");
const router = express.Router();
const ClothingItem = require("../models/clothingItem");

// GET all clothing items
router.get("/", async (req, res) => {
  try {
    const clothingitems = await Clothingitem.find();
    res.json(clothingitems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific clothing item
router.get("/:id", getClothingItem, (req, res) => {
  res.json(res.clothingItem);
});

// POST a new clothing item
router.post("/", async (req, res) => {
  const clothingItem = new ClothingItem({
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    category: req.body.category,
    size: req.body.size,
  });
  try {
    const newClothingItem = await clothingItem.save();
    res.status(201).json(newClothingItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a specific clothing item
router.put("/:id", getClothingItem, async (req, res) => {
  if (req.body.name != null) {
    res.clothingItem.name = req.body.name;
  }
  if (req.body.description != null) {
    res.clothingItem.description = req.body.description;
  }
  if (req.body.imageUrl != null) {
    res.clothingItem.imageUrl = req.body.imageUrl;
  }
  if (req.body.category != null) {
    res.clothingItem.category = req.body.category;
  }
  if (req.body.size != null) {
    res.clothingItem.size = req.body.size;
  }
  try {
    const updatedClothingItem = await res.clothingItem.save();
    res.json(updatedClothingItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific clothing item
router.delete("/:id", getClothingItem, async (req, res) => {
  try {
    await res.clothingItem.remove();
    res.json({ message: "Deleted clothing item" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a specific clothing item by ID
async function getClothingItem(req, res, next) {
  try {
    const clothingItem = await ClothingItem.findById(req.params.id);
    if (clothingItem == null) {
      return res.status(404).json({ message: "Cannot find clothing item" });
    }
    res.clothingItem = clothingItem;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Like a clothing item
router.post("/:id/like", async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findById(req.params.id);
    if (clothingItem == null) {
      return res.status(404).json({ message: "Cannot find clothing item" });
    }
    clothingItem.likes++;
    const updatedClothingItem = await clothingItem.save();
    res.json(updatedClothingItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dislike a clothing item
router.post("/:id/dislike", async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findById(req.params.id);
    if (clothingItem == null) {
      return res.status(404).json({ message: "Cannot find clothing item" });
    }
    clothingItem.dislikes++;
    const updatedClothingItem = await clothingItem.save();
    res.json(updatedClothingItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
