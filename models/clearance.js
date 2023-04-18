const mongoose = require("mongoose");

const Joi = require("joi");

const clearance = new mongoose.Schema({
  studId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  clearanceType: {
    type: String,
    enum: ["sport", "cafe", "faculty", "library"],
    required: true,
  },
  issue: {
    type: String,
    required: true,
    maxlength: 1024,
  },
  issueDetail: {
    type: String,
  },
});

const Clearance = mongoose.model("Clearance", clearance);

const validateClearance = (obj) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),

    issue: Joi.string().min(5).required(),
    issueDetail: Joi.string(),
  });

  return schema.validate(obj);
};

module.exports.Clearance = Clearance;
module.exports.validateClearance = validateClearance;
