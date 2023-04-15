const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: "Elise Bouer",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "{VALUE} is not a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "{VALUE} is not a valid URL",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
