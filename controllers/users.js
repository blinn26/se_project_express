const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errorConstructors/badRequestError");
const UnauthorizedError = require("../errorConstructors/unauthorizedError");
const NotFoundError = require("../errorConstructors/notFoundError");

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        next(new BadRequestError("A user with this email already exists."));
      } else {
        return bcrypt
          .hash(password, 10)
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
            res.status(201).send(userObject);
          });
      }
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

      return bcrypt.compare(password, user.password).then((passwordMatches) => {
        if (!passwordMatches) {
          next(new UnauthorizedError("Invalid credentials"));
        } else {
          const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: "7 days",
          });

          res.status(200).json({ token });
        }
      });
    })
    .catch((error) => {
      next(error);
    });
};
const getCurrentUser = (req, res, next) => {
  User.findById(req.user.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.status(200).send({ data: user });
      }
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
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        const updatedUserProps = { ...user._doc };
        updates.forEach((update) => {
          updatedUserProps[update] = req.body[update];
        });

        User.findByIdAndUpdate(userId, updatedUserProps, { new: true })
          .then((updatedUserResult) => {
            res.send({ data: updatedUserResult });
          })
          .catch((error) => {
            next(error);
          });
      }
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
