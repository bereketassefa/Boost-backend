const mongoose = require("mongoose");

const Joi = require("joi");

const infoSchema = new mongoose.Schema({
  semister: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  registerStartDate: {
    type: Date,
    required: true,
  },
  registerEndDate: {
    type: Date,
    required: true,
  },
  semisterStartDate: {
    type: Date,
    required: true,
  },
  semisterEndDate: {
    type: Date,
    required: true,
  },
});

const Information = mongoose.model("Information", infoSchema);

const validateInfo = (obj) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().min(4).max(7).required(),
  });

  return schema.validate(obj);
};

module.exports.Information = Information;
module.exports.validateInfo = validateInfo;
