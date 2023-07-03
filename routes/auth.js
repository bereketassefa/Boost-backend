const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const { Student } = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Stuff } = require("../models/Stuff");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let student = await Student.findOne({ email: req.body.email });
  let stuff = await Stuff.findOne({ email: req.body.email });
  if (!student && !stuff)
    return res.status(400).json("Invalid email or password");

  const validPassword = await bcrypt.compare(
    req.body.password,
    student ? student.password : stuff.password
  );

  if (!validPassword) return res.status(400).send("Invalid email or password");
  let response;
  if (student) {
    response = {
      _id: student._id,
      role: student.role,
    };
  } else {
    response = {
      _id: stuff._id,
      role: stuff.role,
    };
  }

  const token = jwt.sign(response, process.env.jwt_secret);
  res
    .status(200)
    .header("x-auth-token", token)
    .send({ ...response, token: token });
});

function validate(user) {
  const Schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  console.log(Schema.validate(user));
  return Schema.validate(user);
}
module.exports = router;
