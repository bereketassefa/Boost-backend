const mongoose = require("mongoose");

const Joi = require("joi");

fields3 = ["IT"];
fields4 = ["Computer Science"];
fields5 = ["Software Engineering", "Electrical Engineering"];

const studentSchema = new mongoose.Schema({
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
  fieldOfStudy: {
    type: String,
    enum: [...fields3, ...fields4, ...fields5],
    required: true,
    maxlength: 1024,
  },
  isRegistered: {
    type: {},
    required: true,
    maxlength: 1024,
  },
  role: {
    type: String,
    default: "student",
    enum: ["student"],
  },
});

const Student = mongoose.model("Student", studentSchema);

const validateStudent = (obj) => {
  const schema = Joi.object({
    fullName: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    fieldOfStudy: Joi.string().required(),
  });

  return schema.validate(obj);
};

module.exports.Student = Student;
module.exports.validateStudent = validateStudent;
