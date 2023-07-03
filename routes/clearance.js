const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Clearance, validateClearance } = require("../models/clearance");
const auth = require("../middleware/auth");
const stuffMiddleware = require("../middleware/stuff");
const { Student } = require("../models/student");
const Joi = require("joi");
const { Stuff } = require("../models/Stuff");
Joi.objectId = require("joi-objectid")[Joi];

const router = express.Router();

router.get("/:id", [auth, stuffMiddleware], async (req, res) => {
  console.log(req.params.id);
  const result = await Clearance.find({ clearanceType: req.user.role })
    // .select("nameissue")
    .populate("studId")
    .limit(10)
    .skip(10 * (req.params.id - 1));

  const count = await Clearance.find({ clearanceType: req.user.role });
  const name = await Stuff.find({ _id: req.user._id }).select("fullName");

  return res.send([result, { val: count.length, name: name }]);
  // .sort({
  //     name: 'asc'
  // })
});

router.post("/", [auth, stuffMiddleware], async (req, res) => {
  const { error } = validateClearance(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await Student.findOne({ email: req.body.email });
  if (!user) return res.json("email does't exist in the database");

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
