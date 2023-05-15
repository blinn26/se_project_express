const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { HTTP_ERRORS } = require("../utils/httpErrors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(HTTP_ERRORS.ALREADY_EXIST)
        .send({ message: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    const userObject = user.toObject();
    delete userObject.password;
    return res.status(HTTP_ERRORS.CREATED).send(userObject);
  } catch (error) {
    console.log("Error on createUser:", error);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(HTTP_ERRORS.UNAUTHORIZED)
        .json({ message: "User not found" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res
        .status(HTTP_ERRORS.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7 days",
    });

    return res.status(HTTP_ERRORS.OK).json({ token });
  } catch (error) {
    console.log("Error on login:", error);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(HTTP_ERRORS.NOT_FOUND)
        .send({ message: "User not found" });
    }

    return res.status(HTTP_ERRORS.OK).send({ data: user });
  } catch (error) {
    console.log("Error on getCurrentUser:", error);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "avatar"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res
        .status(HTTP_ERRORS.BAD_REQUEST)
        .send({ message: "Invalid updates!" });
    }

    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(HTTP_ERRORS.NOT_FOUND)
        .send({ message: "User not found" });
    }

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save({ validateBeforeSave: true });

    return res.send({ data: user });
  } catch (error) {
    console.log("Error on updateProfile:", error);
    return res
      .status(HTTP_ERRORS.INTERNAL_SERVER_ERROR)
      .send({ message: "Internal server error" });
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
