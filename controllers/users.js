const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");
const { HTTP_ERRORS } = require("../utils/httpErrors");

const BadRequestError = require("../errorConstructors/badRequestError");
const UnauthorizedError = require("../errorConstructors/unauthorizedError");
const NotFoundError = require("../errorConstructors/notFoundError");

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  User.findOne({ email })
    .orFail(new BadRequestError("A user with this email already exists."))
    .then(() => bcrypt.hash(password, 10))
    .then((hashedPassword) =>
      User.create({
        name,
        email,
        password: hashedPassword,
        avatar,
      })
    )
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(HTTP_ERRORS.CREATED).send(userObject);
    })
    .catch((error) => {
      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError("User not found"));
        return;
      }

      bcrypt.compare(password, user.password).then((passwordMatches) => {
        if (!passwordMatches) {
          next(new UnauthorizedError("Invalid credentials"));
          return;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
          expiresIn: "7 days",
        });

        res.status(HTTP_ERRORS.OK).send({ token });
      });
    })
    .catch((error) => {
      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user.userId)
    .orFail(new NotFoundError("User not found"))
    .then((user) => {
      res.status(HTTP_ERRORS.OK).send({ data: user });
    })
    .catch((error) => {
      next(error);
    });
};

const updateProfile = (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "avatar"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    next(new BadRequestError("Invalid updates!"));
    return;
  }

  const { userId } = req.user;

  User.findById(userId)
    .orFail(new NotFoundError("User not found"))
    .then((user) => {
      const updatedUserProps = { ...user._doc };
      updates.forEach((update) => {
        updatedUserProps[update] = req.body[update];
      });

      return User.findByIdAndUpdate(userId, updatedUserProps, { new: true });
    })
    .then((updatedUserResult) => {
      res.status(HTTP_ERRORS.OK).send({ data: updatedUserResult });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
