const express = require("express");
const auth = require("../middleware/auth");
const advisorMiddleware = require("../middleware/Advisor");
const { Student } = require("../models/student");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/", [auth, advisorMiddleware], async (req, res) => {
  const result = await Student.aggregate([
    { $match: { advisor: req.user._id, registrarClearance: false } },

    {
      $lookup: {
        from: "clearances",
        localField: "_id",
        foreignField: "studId",
        as: "clearance",
      },
    },
  ]);
  return res.send(result);
});
router.post("/", [auth, advisorMiddleware], async (req, res) => {
  const newresult = await Student.updateOne(
    { _id: req.body.id },
    {
      $set: {
        registrarClearance: true,
      },
    }
  );
  res.send(newresult);
});

module.exports = router;
