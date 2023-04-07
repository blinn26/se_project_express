const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (valid) => validator.isURL(valid),
      message: "{VALID} Link is not a valid URL!",
    },
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
