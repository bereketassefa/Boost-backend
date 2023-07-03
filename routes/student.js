const express = require("express");
const mongoose = require("mongoose");
const { Student, validateStudent } = require("../models/student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const student = require("../middleware/student");
const auth = require("../middleware/auth");
// const { options } = require("joi");

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
  if (fields3.includes(field)) {
    console.log("field 3");
    return year;
  } else if (fields4.includes(field)) {
    console.log("field 4");
    return { ...year, 41: options[0], 42: options[0] };
  } else {
    console.log("field 5");
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

//list of registered students
router.get("/registered", async (req, res) => {
  const result = await Student.find({ regStatus: "enrolled" }).select(
    "-password -isRegistered -role -__v"
  );
  res.send(result);
});

//list of students who are not registered yet
router.get("/unregistered", async (req, res) => {
  const result = await Student.find({ regStatus: "notstarted" }).select(
    "-password -isRegistered -role -__v"
  );
  res.send(result);
});

//responde with all students
router.get("/", async (req, res) => {
  const result = await Student.find().select(
    "-password -isRegistered -role -__v"
  );
  res.send(result);
});

//allow student to registered
router.post("/register", [auth, student], async (req, res) => {
  const result = await Student.findOne({ _id: req.user._id });
  if (!result) {
    res.status(404).send("student");
  }

  if (result.regStatus !== options[0] && result.regStatus !== options[2]) {
    console.log(result.regStatus);
    res.send("You have't finished a semisterr");
  } else {
    prev = "";
    for (const [k, v] of Object.entries(result.isRegistered)) {
      prev = v;
      if (v === options[1] || v === options[3]) {
        result.regStatus = result.isRegistered[k];
        console.log(await result.save());
        return res.send("You have't finished a semister");
      }

      if (v === options[0] || (prev === options[2] && v === options[0])) {
        result.isRegistered[k] = options[1];
        result.regStatus = options[1];
        console.log(result);
        break;
      }
    }

    const newresult = await Student.updateOne(
      { _id: result._id },
      {
        $set: result,
      }
    );
    res.send(newresult);
    // res.send("result");
  }

  // res.send("result");
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
    regStatus: "notstarted",
    advisor: "648444b27adfa6ab0edcd238",
  });
  let result = await student.save();

  const token = jwt.sign(
    { _id: result._id, role: "student" },
    "jwtPrivateToken"
  );

  res
    // .header("x-auth-token", token)
    .send({ email: result.email, _id: result._id });
});

module.exports = router;
