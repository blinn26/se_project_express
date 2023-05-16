const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().messages({
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.url": "The avatar url must be a valid url",
      "string.empty": "The avatar field must not be empty",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "Please enter a valid email",
      "string.required": "The email field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.required": "The password field must be filled in",
    }),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Please enter a valid email",
      "string.required": "The email field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.required": "The password field must be filled in",
    }),
  }),
});

const validateId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = { validateCardBody, validateUser, validateAuth, validateId };
