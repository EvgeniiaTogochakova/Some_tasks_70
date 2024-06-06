const joi = require("joi");

const usersSchema = joi.object({
  name: joi.string().min(1).required(),
  surname: joi.string().min(1).required(),
  age: joi.number().min(0).required(),
  city: joi.string().min(1),
});

module.exports = { usersSchema };
