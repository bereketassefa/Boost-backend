const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const student = require("../middleware/student");
const auth = require("../middleware/auth");
const { Student } = require("../models/student");
const { Clearance } = require("../models/clearance");
const { Stuff } = require("../models/Stuff");
const router = express.Router();

router.get("/name", [auth], async (req, res) => {
  let result;
  if (req.user.role === "student") {
    result = await Student.find({ _id: req.user._id }).select("fullName");
  } else {
    result = await Stuff.find({ _id: req.user._id }).select("fullName");
  }
  return res.send(result);
});

router.get("/", [auth, student], async (req, res) => {
  response = {};

  response.regStatus = await checkIfRegistered(req.user._id);
  console.log(await checkIfRegistered(req.user._id));
  if (response.regStatus === "notstarted") {
    response.remainingTime = new Date(2023, 6, 1).getTime();
  }
  const result = await checkClearanceStatus(req.user._id);

  if (result === false) {
    response.clearanceStatus = "clear";
  } else {
    response.clearanceStatus = result;
  }
  return res.send(response);
});

async function checkIfRegistered(id) {
  const result = await Student.findOne({ _id: id }).select("regStatus");

  return result.regStatus;
}
async function checkClearanceStatus(id) {
  const result = await Clearance.find({ studId: id });

  return result;
}

module.exports = router;
