const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Clearance, validateClearance } = require("../models/clearance");
const auth = require("../middleware/auth");
const stuffMiddleware = require("../middleware/stuff");
const { Student } = require("../models/student");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")[Joi];

const router = express.Router();

router.post("/", [auth, stuffMiddleware], async (req, res) => {
  const { error } = validateClearance(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Student.findOne({ email: req.body.email });
  if (!user) return res.send("email does't exist in the database");

  const userid = user._id;

  const stuff = Clearance({
    studId: userid,
    clearanceType: req.user.role,
    issue: req.body.issue,
    issueDetail: req.body.issueDetail,
  });
  let result = await stuff.save();

  res.send(result);
});

router.delete("/:id", [auth, stuffMiddleware], async (req, res) => {
  console.log(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("invalid id");

  const result = await Clearance.deleteOne({ _id: req.params.id });
  return res.send(result);
});

module.exports = router;
