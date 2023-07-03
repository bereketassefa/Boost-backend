const mongoose = require("mongoose");

const Joi = require("joi");

options = [
  "admin",
  "sport",
  "cafe",
  "faculty",
  "library",
  "advisor",
  "registrar",
];

const stuffSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
  },
  role: { type: String, enum: options },
  field: {
    type: String,
  },
});

const Stuff = mongoose.model("Stuff", stuffSchema);

const validateStuff = (obj) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().min(4).required(),
    field: Joi.string(),
  });

  return schema.validate(obj);
};

module.exports.Stuff = Stuff;
module.exports.validateStuff = validateStuff;
