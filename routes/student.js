const express = require("express");
const mongoose = require("mongoose");
const { Student, validateStudent } = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

fields3 = ["IT"];
fields4 = ["Computer Science"];
fields5 = ["Software Engineering", "Electrical Engineering"];

options = ["notstarted", "enrolled", "finished", "failed"];

year = {
  11: options[0],
  12: options[0],
  21: options[0],
  22: options[0],
  31: options[0],
  32: options[0],
};
function years(field) {
  console.log(field);
  if (field in fields3) {
    return year;
  } else if (field in fields4) {
    return { ...year, 41: options[0], 42: options[0] };
  } else {
    return {
      ...year,
      41: options[0],
      42: options[0],
      51: options[0],
      52: options[0],
    };
  }
}

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await Student.find().select(
    "-password -isRegistered -role -__v"
  );
  res.send(result);
});

router.post("/signup", async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Student.findOne({ email: req.body.email });
  if (user) return res.send("email already exist");

  const salt = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(req.body.password, salt);

  const student = Student({
    fullName: req.body.fullName,
    email: req.body.email,
    password: hashed,
    fieldOfStudy: req.body.fieldOfStudy,
    isRegistered: years(req.body.fieldOfStudy),
  });
  let result = await student.save();

  const token = jwt.sign({ _id: result._id, isAdmin: true }, "jwtPrivateToken");

  res
    .header("x-auth-token", token)
    .send({ email: result.email, _id: result._id });
});

module.exports = router;
