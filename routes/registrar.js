const express = require("express");
const auth = require("../middleware/auth");
const advisorMiddleware = require("../middleware/Advisor");
const { Student, validateStudent } = require("../models/student");
const { default: mongoose } = require("mongoose");
const registrar = require("../middleware/registrar");
const { Clearance } = require("../models/clearance");
const router = express.Router();

router.get("/", [auth, registrar], async (req, res) => {
  const result = await Student.find({
    regStatus: "enrolled",
    registrarClearance: true,
  });

  return res.send(result);
});
router.get("/:id", [auth, registrar], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("invalid id");

  const result = await Clearance.find({
    studId: req.params.id,
  });

  const result2 = await Student.findOne({
    _id: req.params.id,
  }).select("-password -isRegistered");

  let profile = {
    studentInfo: result2,
    clearanceInfo: result,
  };

  return res.send(profile);
});

router.post("/", [auth, registrar], async (req, res) => {
  const newresult = await Student.updateOne(
    { _id: req.body.id },
    {
      $set: {
        regStatus: "finished",
      },
    }
  );
  res.send(newresult);
});

module.exports = router;
