const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: function (value) {
      return validator.isURL(value);
    },
    message: "{VALUE} is not a valid URL",
  },
});

module.exports = mongoose.model("User", userSchema);
